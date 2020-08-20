import config from './config.js';
const PTP = 'player-token-permissions';

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

Hooks.once('ready', () => {
  // Add keyboard listener
})

/*
 * React to keyboard events and if delete requested, process and emit socket event
 */
function deleteToken(e) {
  // Only react on delete key
  if (e.which !== 46) return;
  // Do not react if user is a GM
  if (game.user.isGM) return;
  // Only react if token layer is active
  if (ui.controls.activeControl !== 'token') return;

  // Tokens to be deleted
  let del = [];
  
  if (game.settings.get(PTP, 'select') === true) {
    canvas.tokens.controlled.forEach(token => {
      if(checkPermission(token)) del.push(token.id);
    });
  }

  if (game.settings.get(PTP, 'hover') === true) {
    let hover = canvas.tokens._hover;
    if(hover && checkPermission(hover) && !del.includes(hover.id)) {
      del.push(hover.id);
    }
  }
  
  if (game.settings.get(PTP, 'target') === true) {
    // Todo: implement this
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
      let tk = canvas.tokens.get(id);
      if (confirmPermission(id, data.user)) tk.delete();
    });
  } else {
    // todo emit error that gm must be on same scene
  }
}

/*
 * Checks if player has permissions to delete a token
 */
function checkPermission(token, player) {
  let perm = game.settings.get(PTP, 'delete');
  if (perm === '0') return true;
  else if (perm === '1' && token.observer === true) return true;
  else if (perm === '2' && token.limited === true) return true;
  else if (perm === '3' && token.owner === true) return true;
  // Todo: should display error
  console.log(`${PTP} | You don't have permissions to delete this token`);
  return false;
}

/*
 * Confirms if player has permissions to delete a token
 */
function confirmPermission(tokenId, playerId) {
  return true;
}