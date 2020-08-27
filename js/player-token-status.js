import { PTP } from './config.js';

/**
 * Requests status effect be assigned to the given tokens
 * - If user is GM, it will be assigned directly
 * - Otherwise it will send socket request to a GM to do so
 * @param {String}  img     The image URL to apply
 * @param {Array}   tokens  Array of tokens to be assigned to
 * @param {Boolean} [large] false = standard size (default), true = large overlay
 * 
 * @example
 * requestStatus('icons/svg/fire.svg', ['<token-id>'], true);
 */
export function requestStatus(img, tokens, large = false) {
  // If user is gm, just assign status effect directly
  if (game.user.isGM) {
    canvas.tokens.placeables.forEach(token => {
      if (tokens.includes(token.id)) {
        if (large) token.toggleOverlay(data.img);
        else token.toggleEffect(data.img);
      }
    });
  }

  // If user is not gm, request gm to set status
  else {
    // Do not react if player has less perms than min
    if (game.user.role < game.settings.get(PTP, 'sPlayerType')) return;
    // Make sure at least one token given
    if (!tokens.length) return;
    // Make sure img string exists
    if (img === null || !img.length) return;
    // Request GM user to set status for tokens
    game.socket.emit('module.player-token-permissions', {
      op: 'status',
      user: game.user.id,
      scene: canvas.scene.id,
      img,
      tokens,
      large
    });
    console.log(`${PTP} | Requesting GM set status ${img} for tokens ${JSON.stringify(tokens)} from scene ${canvas.scene.id}`);
  }
}

export function handleStatus(data) {
  console.log(`${PTP} | Player ${data.user} requests status ${data.img} for tokens ${JSON.stringify(data.tokens)} from scene ${data.scene}`);
  // Do not react if player has less perms than min
  let user = game.users.get(data.user);
  if (user.role < game.settings.get(PTP, 'sPlayerType')) return;
  // If GM is not on same scene, don't react
  if (canvas.scene.id === data.scene) {
    canvas.tokens.placeables.forEach(token => {
      if (data.tokens.includes(token.id)) {
        if (data.large) token.toggleOverlay(data.img);
        else token.toggleEffect(data.img);
      }
    });
  } else {
    let usr = game.users.get(data.user);
    ui.notifications.warn(`${usr.name} requested status effect for [${data.tokens.length}] tokens but you are not on the same scene.`);
  }
}