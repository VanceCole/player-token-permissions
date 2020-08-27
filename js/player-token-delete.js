import config from './config.js';
const PTP = 'player-token-permissions';

Hooks.on('ready', () => {
  $('[data-tab=combat]')[0].click()
})

Hooks.once('init', () => {
  // Register settings
  config.forEach((cfg) => {
    game.settings.register(PTP, cfg.name, cfg.data);
  });
  // Add socket listener for delete events
  game.socket.on(`module.${PTP}`, handleDelete);
  // Add delete listener
  $(document).keydown(deleteToken);
});

/*
 * React to keyboard events and if delete requested, process and emit socket event
 */
function deleteToken(e) {
  // Only react on delete key
  if (e.which !== 46) return;
  console.log(e);
  // Do not react if user is a GM
  if (game.user.isGM) return;
  // Do not react if player has less perms than min
  if (game.user.role < game.settings.get(PTP, 'playerType')) return;
  // Only react if token layer is active
  if (ui.controls.activeControl !== 'token') return;

  // Tokens to be deleted
  let del = [];
  
  if (game.settings.get(PTP, 'hover')) {
    let hover = canvas.tokens._hover;
    if(hover && checkPermission(hover) && !del.includes(hover.id)) {
      del.push(hover.id);
    }
  }
  
  if (game.settings.get(PTP, 'target')) {
    game.user.targets.forEach(token => {
      if(checkPermission(token)) del.push(token.id);
    });
  }

  if (!del.length) return;
  // Request GM user to delete tokens
  game.socket.emit('module.player-token-permissions', {
    user: game.user.id,
    scene: canvas.scene.id,
    del
  });
  console.log(`${PTP} | Requesting GM delete tokens ${JSON.stringify(del)} from scene ${canvas.scene.id}`);
}

function handleDelete(data) {
  console.log(`${PTP} | Player ${data.user} requests delete tokens ${JSON.stringify(data.del)} from scene ${data.scene}`);
  // If GM is not on same scene, don't delete
  if (canvas.scene.id === data.scene) {
    data.del.forEach(id => {
      canvas.tokens.get(id).delete();
    });
  } else {
    let usr = game.users.get(data.user);
    ui.notifications.warn(`${usr.name} requested deletion of [${data.del.length}] tokens but you are not on the same scene.`);
  }
}

/*
 * Checks if player has permissions to delete a token
 */
function checkPermission(token, player) {
  let perm = game.settings.get(PTP, 'delete');
  if (perm === 0) return true;
  else if (perm === 1 && token.observer === true) return true;
  else if (perm === 2 && token.limited === true) return true;
  else if (perm === 3 && token.owner === true) return true;
  // Todo: should display error
  ui.notifications.warn(`You don't have permission to delete token ${token.name}`);
  return false;
}
