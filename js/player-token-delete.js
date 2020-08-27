import { PTP } from './config.js';

/*
 * React to keyboard events and if delete requested, process and emit socket event
 */
export function deleteToken(e) {
  // Only react on delete key
  if (e.which !== 46) return;
  // Do not react if user is a GM
  if (game.user.isGM) return;
  // Do not react if player has less perms than min
  if (game.user.role < game.settings.get(PTP, 'dPlayerType')) return;
  // Only react if token layer is active
  if (ui.controls.activeControl !== 'token') return;

  // Tokens to be deleted
  let tokens = [];
  
  if (game.settings.get(PTP, 'dHover')) {
    let hover = canvas.tokens._hover;
    if(hover && checkPermission(hover) && !tokens.includes(hover.id)) {
      tokens.push(hover.id);
    }
  }
  
  if (game.settings.get(PTP, 'dTarget')) {
    game.user.targets.forEach(token => {
      if(checkPermission(token)) tokens.push(token.id);
    });
  }

  if (!tokens.length) return;
  // Request GM user to delete tokens
  game.socket.emit('module.player-token-permissions', {
    op: 'delete',
    user: game.user.id,
    scene: canvas.scene.id,
    tokens
  });
  console.log(`${PTP} | Requesting GM delete tokens ${JSON.stringify(tokens)} from scene ${canvas.scene.id}`);
}

/*
 * Handles incoming socket delete request
 */
export function handleDelete(data) {
  console.log(`${PTP} | Player ${data.user} requests delete tokens ${JSON.stringify(data.tokens)} from scene ${data.scene}`);
  // Do not react if player has less perms than min
  let user = game.users.get(data.user);
  if (user.role < game.settings.get(PTP, 'dPlayerType')) return;
  // If GM is not on same scene, don't delete
  if (canvas.scene.id === data.scene) {
    data.tokens.forEach(id => {
      canvas.tokens.get(id).delete();
    });
  } else {
    let usr = game.users.get(data.user);
    ui.notifications.warn(`${usr.name} requested deletion of [${data.tokens.length}] tokens but you are not on the same scene.`);
  }
}

/*
 * Checks if player has permissions to delete a token
 */
function checkPermission(token, player) {
  // Check if user has appropriate ownership/etc of token to be deleted
  let perm = game.settings.get(PTP, 'dPerm');
  if (perm === 0) return true;
  else if (perm === 1 && token.observer === true) return true;
  else if (perm === 2 && token.limited === true) return true;
  else if (perm === 3 && token.owner === true) return true;
  // Todo: should display error
  ui.notifications.warn(`You don't have permission to delete token ${token.name}`);
  return false;
}
