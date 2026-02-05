/**
 * Next.js Instrumentation
 * Runs once when the server starts (both dev and prod)
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on Node.js runtime (not Edge)
    const { ensureDatabaseInitialized } = await import('./db/init');
    
    try {
      console.log('[Startup] Checking database initialization...');
      await ensureDatabaseInitialized();
      console.log('[Startup] Database ready.');
    } catch (error) {
      console.error('[Startup] Database initialization failed:', error);
      // Don't crash the app, let it start and show errors in requests
    }
  }
}
