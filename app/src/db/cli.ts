#!/usr/bin/env node
/**
 * Database CLI Tool
 * Usage: npx tsx src/db/cli.ts [command]
 * Commands:
 *   status  - Check database status
 *   init    - Initialize database
 *   reset   - Drop and recreate all tables (DANGEROUS)
 */

import { 
  getPool, 
  getDatabaseStatus, 
  initializeDatabase,
  getMigrationFiles 
} from './init';

async function main() {
  const command = process.argv[2] || 'status';
  const pool = getPool();
  
  try {
    switch (command) {
      case 'status': {
        console.log('Checking database status...\n');
        const status = await getDatabaseStatus(pool);
        const migrations = getMigrationFiles();
        
        console.log('Database Status:');
        console.log(`  Initialized: ${status.initialized ? 'Yes' : 'No'}`);
        console.log(`  Version: ${status.version || 'N/A'}`);
        console.log(`  Executed Migrations: ${status.migrations.length}`);
        
        if (status.migrations.length > 0) {
          status.migrations.forEach(m => console.log(`    - ${m}`));
        }
        
        const pending = migrations.filter(m => !status.migrations.includes(m.version));
        if (pending.length > 0) {
          console.log(`  Pending Migrations: ${pending.length}`);
          pending.forEach(m => console.log(`    - ${m.version}_${m.name}`));
        }
        break;
      }
      
      case 'init': {
        console.log('Initializing database...\n');
        const result = await initializeDatabase(pool);
        
        if (result.success) {
          console.log('\n✅ ' + result.message);
        } else {
          console.error('\n❌ ' + result.message);
          process.exit(1);
        }
        break;
      }
      
      case 'reset': {
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ Cannot reset database in production!');
          process.exit(1);
        }
        
        console.log('⚠️  This will DROP ALL TABLES and recreate them.');
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('\nDropping all tables...');
        await pool.query(`
          DROP TABLE IF EXISTS admin_audit_log CASCADE;
          DROP TABLE IF EXISTS password_reset_tokens CASCADE;
          DROP TABLE IF EXISTS verification_tokens CASCADE;
          DROP TABLE IF EXISTS sessions CASCADE;
          DROP TABLE IF EXISTS accounts CASCADE;
          DROP TABLE IF EXISTS plan_shares CASCADE;
          DROP TABLE IF EXISTS plan_templates CASCADE;
          DROP TABLE IF EXISTS plans CASCADE;
          DROP TABLE IF EXISTS users CASCADE;
          DROP TABLE IF EXISTS system_options CASCADE;
          DROP TABLE IF EXISTS migrations CASCADE;
          DROP TYPE IF EXISTS user_role CASCADE;
          DROP TYPE IF EXISTS user_status CASCADE;
          DROP TYPE IF EXISTS plan_status CASCADE;
        `);
        
        console.log('Reinitializing database...');
        const result = await initializeDatabase(pool);
        
        if (result.success) {
          console.log('\n✅ Database reset complete.');
        } else {
          console.error('\n❌ ' + result.message);
          process.exit(1);
        }
        break;
      }
      
      default:
        console.log('Unknown command:', command);
        console.log('Available commands: status, init, reset');
        process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
