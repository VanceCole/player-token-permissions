import { PTP } from './config.js';
import { gmActive } from './helpers.js';

/*
 * Checks if player has permissions to delete a token
 */
function checkPermission(token) {
  // Check if user has appropriate ownership/etc of token to be deleted
  const perm = game.settings.get(PTP, 'dPerm');
  if (perm === 0) return true;
  if (perm === 1 && token.observer === true) return true;
  if (perm === 2 && token.limited === true) return true;
  if (perm === 3 && token.owner === true) return true;
  // Todo: should display error
  ui.notifications.warn(`You don't have permission to delete token ${token.name}`);
  return false;
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
  // Do not react if player has less perms than min
  if (game.user.role < game.settings.get(PTP, 'dPlayerType')) return;
  // If user is gm, just delete directly
  if (game.user.isGM) {
    canvas.scene.deleteEmbeddedDocuments('Token', tokens);
  }
  // If not gm, request deletion via socket
  else {
    // Request GM user to delete tokens
    game.socket.emit('module.player-token-permissions', {
      op: 'delete',
      user: game.user.id,
      scene: canvas.scene.id,
      tokens,
    });
    // eslint-disable-next-line no-console
    console.log(`${PTP} | Requesting GM delete tokens ${JSON.stringify(tokens)} from scene ${canvas.scene.id}`);
  }
}

/*
 * React to keyboard events and if delete requested, process and emit socket event
 */
export function deleteToken(e) {
  // Only react on delete key
  if (e.which !== 46) return;
  // Do not react if game is not target
  if (!e.target.tagName === 'BODY') return;
  // Only react if token layer is active
  if (ui.controls.activeControl !== 'token') return;
  // Do not react if user is a GM
  if (game.user.isGM) return;

  // Tokens to be deleted
  const tokens = [];

  if (game.settings.get(PTP, 'dHover')) {
    const hover = canvas.tokens._hover;
    if (hover && checkPermission(hover) && !tokens.includes(hover.id)) {
      tokens.push(hover.id);
    }
  }

  if (game.settings.get(PTP, 'dTarget')) {
    game.user.targets.forEach((token) => {
      if (checkPermission(token)) tokens.push(token.id);
    });
  }

  if (!tokens.length) return;
  requestDelete(tokens);
}

/*
 * Handles incoming socket delete request
 */
export function handleDelete(data) {
  // eslint-disable-next-line no-console
  console.log(`${PTP} | Player ${data.user} requests delete tokens ${JSON.stringify(data.tokens)} from scene ${data.scene}`);
  // Do not react if player has less perms than min
  const user = game.users.get(data.user);
  if (user.role < game.settings.get(PTP, 'dPlayerType')) return;

  // Make sure GM is on same scene
  if (canvas.scene.id === data.scene) {
    canvas.scene.deleteEmbeddedDocuments('Token', data.tokens);
  }
  // If GM not on same scene, display a warning
  else {
    const usr = game.users.get(data.user);
    ui.notifications.warn(`${usr.name} requested deletion of [${data.tokens.length}] tokens but you are not on the same scene.`);
    game.socket.emit('module.player-token-permissions', {
      op: 'warn',
      user: data.user,
      msg: `Could not delete [${data.tokens.length}] tokens because GM is not on the same scene.`,
    });
  }
}
