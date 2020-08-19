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
    canvas.tokens.controlled.forEach(token => {
      if (token.owner === true) del.push(token.id);
    });

    // Request GM user to delete tokens
    game.socket.emit('module.player-token-delete', { user: game.user.id, del, scene: canvas.scene.id});
    console.log(`PTD | Requesting GM delete tokens ${JSON.stringify(del)} from scene ${canvas.scene.id}`);
  });
})

Hooks.on('init', () => {
  game.socket.on('module.player-token-delete', (data) => {
    console.log(`PTD | Player ${data.user} requests delete tokens ${JSON.stringify(data.del)} from scene ${data.scene}`);
    const scene = game.scenes.find(scene => scene.id === data.scene);
    if (canvas.scene.id === data.scene) {
      data.del.forEach(id => {
        canvas.tokens.placeables.find(token => token.id = id).delete();
      });
    } else {
      // emit error that gm must be on same scene
    }
  });
});