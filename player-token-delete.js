Hooks.on('ready', () => {
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
    let perm = game.settings.get('player-token-delete', 'permission-level');
    // For each token, check if player has permissions to delete and add to array
    canvas.tokens.controlled.forEach(token => {
      if(checkPermission(token)) del.push(token.id);
    });

    let hover = canvas.tokens._hover;
    if(checkPermission(hover)) del.push(hover.id);

    // Request GM user to delete tokens
    game.socket.emit('module.player-token-delete', { user: game.user.id, del, scene: canvas.scene.id});
    console.log(`PTD | Requesting GM delete tokens ${JSON.stringify(del)} from scene ${canvas.scene.id}`);
  });
})

Hooks.once('init', () => {
  // Register permission level setting
  game.settings.register('player-token-delete', 'permission-level', {
    name: 'Minimum permission to delete',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "owner": "Owner",
      "observer": "Observer",
      "any": "Any"
    },
    default: "owner",
  });

  // Add socket listener for delete events
  game.socket.on('module.player-token-delete', (data) => {
    console.log(`PTD | Player ${data.user} requests delete tokens ${JSON.stringify(data.del)} from scene ${data.scene}`);
    const scene = game.scenes.find(scene => scene.id === data.scene);
    if (canvas.scene.id === data.scene) {
      data.del.forEach(id => {
        let tk = canvas.tokens.placeables.find(token => token.id === id);
        if (confirmPermission(id, data.user)) tk.delete();
      });
    } else {
      // emit error that gm must be on same scene
    }
  });
});

function checkPermission(token, player) {
  let perm = game.settings.get('player-token-delete', 'permission-level');
  if (perm === 'any') return true;
  else if (perm === 'observer' && token.observer === true) return true;
  else if (perm === 'owner' && token.owner === true) return true;
  return false;
}

function confirmPermission(tokenId, playerId) {
  return true;
}