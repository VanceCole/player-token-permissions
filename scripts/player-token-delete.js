import { APTDTT } from './aptdtt.js';

function gmActive() {
  return (!!game.users.filter((u) => u.active && u.isGM).length);
}

/**
 * Requests tokens be deleted
 * - If user is GM, it will be deleted directly
 * - Otherwise it will send socket request to a GM to do so
 * @param {Array|String}  ids     Token IDs to be deleted
 * @example
 * requestDelete(['<token-id>']);
 */
export function requestDelete(ids) {
  const tokens = (typeof ids === 'string') ? [ids] : ids;
  if (!tokens.length) return;
  if (!gmActive()) {
    ui.notifications.warn(`Could not delete [${tokens.length}] tokens because there is no GM connected.`);
    return;
  }
  // If user is gm, just delete directly
  if (game.user.isGM) {
    canvas.scene.deleteEmbeddedDocuments('Token', tokens);
  }
  // If not gm, request deletion via socket
  else {
    // Request GM user to delete tokens
    game.socket.emit(`module.${APTDTT}`, {
      op: 'delete',
      user: game.user.id,
      scene: canvas.scene.id,
      tokens,
    });
    // eslint-disable-next-line no-console
    console.log(`${APTDTT} | Requesting GM delete tokens ${JSON.stringify(tokens)} from scene ${canvas.scene.id}`);
  }
}

/*
 * React to keyboard events and if delete requested, process and emit socket event
 */
export function possiblyDeleteTokens(e) {
  // Only react on delete key
  if (e.which !== 46) return;
  // Do not react if game is not target
  if (!e.target.tagName === 'BODY') return;
  // Only react if token layer is active
  if (ui.controls.activeControl !== 'token') return;
  // Do not react if user is a GM
  if (game.user.isGM) return;

  // Tokens to be deleted - controlled tokens
  const tokens = canvas.tokens.controlled;

  if (!tokens.length) return;
  requestDelete(tokens.map(t => t.id));
}

/*
 * Handles incoming socket delete request
 */
export function handleDelete(data) {
  // eslint-disable-next-line no-console
  console.log(`${APTDTT} | Player ${data.user} requests delete tokens ${JSON.stringify(data.tokens)} from scene ${data.scene}`);
  const scene = game.scenes.get(data.scene);
  scene.deleteEmbeddedDocuments('Token', data.tokens);
}
