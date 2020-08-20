import config from './config.js';

Hooks.once('init', () => {
  // Register settings
  config.forEach((cfg) => {
    game.settings.register('player-token-permissions', cfg.name, cfg.data);
  });
  // Add socket listener for delete events
  game.socket.on('module.player-token-permissions', handleDelete);
});

Hooks.once('ready', () => {
  // Add keyboard listener
  $(document).keydown((e) => {
    // Do not react if user is a GM
    if (game.user.isGM) return;
    // Only react if token layer is active
    if (ui.controls.activeControl !== 'token') return;
    // Only react on delete key
    if (e.which !== 46) return;

    // Tokens to be deleted
    let del = [];
    // Get permission setting
    let perm = game.settings.get('player-token-permissions', 'delete');
    // For each token, check if player has permissions to delete and add to array
    canvas.tokens.controlled.forEach(token => {
      if(checkPermission(token)) del.push(token.id);
    });

    let hover = canvas.tokens._hover;
    if(hover && checkPermission(hover) && !del.includes(hover.id)) {
      del.push(hover.id);
    }

    // Request GM user to delete tokens
    game.socket.emit('module.player-token-permissions', {
      user: game.user.id,
      scene: canvas.scene.id,
      del
    });
    console.log(`PTD | Requesting GM delete tokens ${JSON.stringify(del)} from scene ${canvas.scene.id}`);
  });
})

function handleDelete(data) {
  console.log(`Player Token Permissions | Player ${data.user} requests delete tokens ${JSON.stringify(data.del)} from scene ${data.scene}`);

  if (canvas.scene.id === data.scene) {
    data.del.forEach(id => {
      let tk = canvas.tokens.get(id);
      if (confirmPermission(id, data.user)) tk.delete();
    });
  } else {
    // emit error that gm must be on same scene
  }
}

// Check if player has permission to request deletion
function checkPermission(token, player) {
  let perm = game.settings.get('player-token-permissions', 'delete');
  if (perm === '0') return true;
  else if (perm === '1' && token.observer === true) return true;
  else if (perm === '2' && token.limited === true) return true;
  else if (perm === '3' && token.owner === true) return true;
  // Todo: should display error
  console.log(`PTD | You don't have permissions to delete this token`);
  return false;
}

// Confirm player has permission to request deletion
function confirmPermission(tokenId, playerId) {
  return true;
}