// LEGACY: Socket.io has been replaced with polling for chat delivery.
// This function is kept as a no-op so any remaining imports don't break,
// but it no longer does anything. Safe to remove entirely once you've
// confirmed nothing imports emitToUser anymore.

/**
 * No-op — Socket.io removed in favor of polling.
 * Kept only so existing imports don't break the build.
 */
export function emitToUser(_userId: string, _event: string, _payload: unknown) {
  // Intentionally does nothing. Chat now delivers via polling
  // (GET /api/messages/:conversationId called on an interval).
}

export default emitToUser;