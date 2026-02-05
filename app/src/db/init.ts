/**
 * Database Initialization Module
 * WordPress-style auto-initialization on first run
 */

import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface MigrationFile {
  version: string;
  name: string;
  path: string;
  checksum: string;
}

interface DatabaseStatus {
  initialized: boolean;
  version: string | null;
  migrations: string[];
}

/**
 * Get database connection pool
 */
export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return new Pool({ connectionString });
}

/**
 * Check if database is initialized
 */
export async function isDatabaseInitialized(pool: Pool): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'system_options'
      ) as exists
    `);
    return result.rows[0]?.exists === true;
  } catch {
    return false;
  }
}

/**
 * Get current database version
 */
export async function getDatabaseVersion(pool: Pool): Promise<string | null> {
  try {
    const result = await pool.query(`
      SELECT option_value FROM system_options 
      WHERE option_name = 'db_version'
    `);
    return result.rows[0]?.option_value || null;
  } catch {
    return null;
  }
}

/**
 * Get executed migrations
 */
export async function getExecutedMigrations(pool: Pool): Promise<string[]> {
  try {
    const result = await pool.query(`
      SELECT version FROM migrations WHERE success = true ORDER BY version
    `);
    return result.rows.map(row => row.version);
  } catch {
    return [];
  }
}

/**
 * Get database status
 */
export async function getDatabaseStatus(pool: Pool): Promise<DatabaseStatus> {
  const initialized = await isDatabaseInitialized(pool);
  const version = initialized ? await getDatabaseVersion(pool) : null;
  const migrations = initialized ? await getExecutedMigrations(pool) : [];
  
  return { initialized, version, migrations };
}

/**
 * Calculate file checksum
 */
function calculateChecksum(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/**
 * Get all migration files from schema directory
 */
export function getMigrationFiles(): MigrationFile[] {
  const schemaDir = path.join(process.cwd(), 'src', 'db', 'schema');
  
  if (!fs.existsSync(schemaDir)) {
    throw new Error(`Schema directory not found: ${schemaDir}`);
  }
  
  const files = fs.readdirSync(schemaDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  return files.map(filename => {
    const filePath = path.join(schemaDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = filename.match(/^(\d+)_(.+)\.sql$/);
    
    return {
      version: match?.[1] || filename,
      name: match?.[2] || filename,
      path: filePath,
      checksum: calculateChecksum(content),
    };
  });
}

/**
 * Execute a single migration file
 */
async function executeMigration(
  client: PoolClient,
  migration: MigrationFile
): Promise<void> {
  const content = fs.readFileSync(migration.path, 'utf-8');
  
  console.log(`  Executing migration: ${migration.version}_${migration.name}`);
  
  try {
    await client.query(content);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Migration failed: ${errorMsg}`);
    throw error;
  }
  
  // Record migration (only if migrations table exists)
  try {
    await client.query(`
      INSERT INTO migrations (version, name, checksum, success)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (version) DO UPDATE SET
        executed_at = CURRENT_TIMESTAMP,
        checksum = $3,
        success = true
    `, [migration.version, migration.name, migration.checksum]);
  } catch {
    // migrations table might not exist yet on first migration
  }
}

/**
 * Initialize database with all schema files
 * WordPress-style: runs on first request if not initialized
 */
export async function initializeDatabase(pool: Pool): Promise<{
  success: boolean;
  message: string;
  migrations: string[];
}> {
  const client = await pool.connect();
  const executedMigrations: string[] = [];
  
  try {
    await client.query('BEGIN');
    
    const migrations = getMigrationFiles();
    const executed = await getExecutedMigrations(pool);
    
    console.log('Database initialization started...');
    console.log(`Found ${migrations.length} migration files`);
    
    for (const migration of migrations) {
      if (!executed.includes(migration.version)) {
        try {
          await executeMigration(client, migration);
          executedMigrations.push(`${migration.version}_${migration.name}`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed at migration ${migration.version}_${migration.name}: ${errorMsg}`);
        }
      } else {
        console.log(`  Skipping migration: ${migration.version}_${migration.name} (already executed)`);
      }
    }
    
    await client.query('COMMIT');
    
    const message = executedMigrations.length > 0
      ? `Database initialized successfully. Executed ${executedMigrations.length} migrations.`
      : 'Database already up to date.';
    
    console.log(message);
    
    return { success: true, message, migrations: executedMigrations };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {
      // Rollback might fail if transaction is already aborted
    });
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database initialization failed:', message);
    return { success: false, message, migrations: executedMigrations };
  } finally {
    client.release();
  }
}

/**
 * Auto-initialize database if needed
 * Call this on app startup or first request
 */
export async function ensureDatabaseInitialized(): Promise<boolean> {
  const pool = getPool();
  
  try {
    const initialized = await isDatabaseInitialized(pool);
    
    if (!initialized) {
      console.log('Database not initialized. Running setup...');
      const result = await initializeDatabase(pool);
      return result.success;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to check/initialize database:', error);
    throw error;
  }
  // Don't close pool - it's a singleton for the app lifecycle
}

/**
 * Get or set a system option (like WordPress get_option/update_option)
 */
export async function getOption(pool: Pool, name: string): Promise<string | null> {
  const result = await pool.query(
    'SELECT option_value FROM system_options WHERE option_name = $1',
    [name]
  );
  return result.rows[0]?.option_value || null;
}

export async function setOption(pool: Pool, name: string, value: string): Promise<void> {
  await pool.query(`
    INSERT INTO system_options (option_name, option_value)
    VALUES ($1, $2)
    ON CONFLICT (option_name) DO UPDATE SET
      option_value = $2,
      updated_at = CURRENT_TIMESTAMP
  `, [name, value]);
}

export async function deleteOption(pool: Pool, name: string): Promise<void> {
  await pool.query('DELETE FROM system_options WHERE option_name = $1', [name]);
}
