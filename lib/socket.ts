// Helper to emit Socket.io events from within API route handlers.
// The Socket.io server instance is attached to `global.io` by server.js
// when the app is started with `node server.js` (see package.json "dev"/"start").

declare global {
  // eslint-disable-next-line no-var
  var io: import('socket.io').Server | undefined;
}

/**
 * Emit an event to a specific user's room (room name = userId).
 * Safe no-op if Socket.io isn't initialized (e.g. running plain `next dev`).
 */
export function emitToUser(userId: string, event: string, payload: unknown) {
  try {
    if (global.io) {
      global.io.to(userId).emit(event, payload);
    }
  } catch (error) {
    console.error('Socket emit error:', error);
  }
}

export default emitToUser;
