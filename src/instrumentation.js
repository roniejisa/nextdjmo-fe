export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import và activate console override cho server
    const { overrideConsole } = await import('./utils/console-override.js');
    overrideConsole();
    console.log('🚀 Server console enhanced via instrumentation!');
  }
}