import { PTP } from './config.js';

/*
 * Check options and toggleEffect/Overlay as appropriate
 */
function setState(token, img, options) {
  // Check whether overlay or regular effect requested
  if (options.overlay) {
    // If no state specified, just toggle
    if (options.state === null) token.toggleOverlay(img);
    // Forced state on
    else if (options.state && token.data.overlayEffect !== img) {
      token.toggleOverlay(img);
    }
    // Forced state off
    else if (!options.state && token.data.overlayEffect === img) {
      token.toggleOverlay(img);
    }
  } else {
    // If no state specified, just toggle
    if (options.state === null) token.toggleEffect(img);
    // Forced state on
    else if (options.state && !token.data.effects.includes(img)) {
      token.toggleEffect(img);
    }
    // Forced state off
    else if (!options.state && token.data.effects.includes(img)) {
      token.toggleEffect(img);
    }
  }
}

/**
 * Requests status effect be assigned to the given tokens
 * - If user is GM, it will be assigned directly
 * - Otherwise it will send socket request to a GM to do so
 * @param {String}  img              The image URL to apply
 * @param {Array}   tokens           Array of tokens to be assigned to
 * @param {Object}  {options}        Configuration options which control how to assign
 *                                     the status effect
 * @param {Boolean} options.overlay  If true, will assign as larger overlay effect
 * @param {Boolean} options.state    null = toggle, true = force on, false = force off
 * @example
 * requestStatus('icons/svg/fire.svg', ['<token-id>'], { overlay: false, state: true });
 */
export function requestStatus(img, tokens, custom_options = {}) {
  const options = mergeObject({
    overlay: false,
    state: null,
  }, custom_options);
  // If user is gm, just assign status effect directly
  if (game.user.isGM) {
    canvas.tokens.placeables.forEach((token) => {
      // Check if token is one requested
      if (tokens.includes(token.id)) {
        setState(token, img, options);
      }
    });
  } else {
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
      options,
    });
    // eslint-disable-next-line no-console
    console.log(`${PTP} | Requesting GM set status ${img} for tokens ${JSON.stringify(tokens)} from scene ${canvas.scene.id}`);
  }
}

/*
 * Handles incoming socket status effect request
 */
export function handleStatus(data) {
  // eslint-disable-next-line no-console
  console.log(`${PTP} | Player ${data.user} requests status ${data.img} for tokens ${JSON.stringify(data.tokens)} from scene ${data.scene}`);
  // Do not react if player has less perms than min
  const user = game.users.get(data.user);
  if (user.role < game.settings.get(PTP, 'sPlayerType')) return;
  // If GM is not on same scene, don't react
  if (canvas.scene.id === data.scene) {
    canvas.tokens.placeables.forEach((token) => {
      if (data.tokens.includes(token.id)) {
        setState(token, data.img, data.options);
      }
    });
  } else {
    ui.notifications.warn(`${user.name} requested status effect for [${data.tokens.length}] tokens but you are not on the same scene.`);
  }
}
