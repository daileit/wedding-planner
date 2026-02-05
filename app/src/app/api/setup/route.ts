/**
 * Database Setup API Route
 * WordPress-style installation endpoint
 * GET /api/setup - Check database status
 * POST /api/setup - Initialize database
 */

import { NextResponse } from 'next/server';
import { 
  getPool, 
  getDatabaseStatus, 
  initializeDatabase,
  getMigrationFiles 
} from '@/db/init';

export async function GET() {
  const pool = getPool();
  
  try {
    const status = await getDatabaseStatus(pool);
    const migrations = getMigrationFiles();
    
    return NextResponse.json({
      initialized: status.initialized,
      version: status.version,
      executedMigrations: status.migrations,
      availableMigrations: migrations.map(m => `${m.version}_${m.name}`),
      pendingMigrations: migrations
        .filter(m => !status.migrations.includes(m.version))
        .map(m => `${m.version}_${m.name}`),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check database status' },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}

export async function POST() {
  const pool = getPool();
  
  try {
    const result = await initializeDatabase(pool);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        migrations: result.migrations,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database initialization failed' },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
