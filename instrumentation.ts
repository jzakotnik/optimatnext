export async function register() {
  // Only run in the actual Node server process (not the edge runtime, not the build).
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduler } = await import("./lib/cache/scheduler");
    await startScheduler();
  }
}
