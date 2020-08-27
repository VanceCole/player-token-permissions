import { config, PTP } from './config.js';
import { deleteToken, handleDelete } from './player-token-delete.js';
import { requestStatus, handleStatus } from './player-token-status.js';

Hooks.once('init', () => {
  // Register settings
  config.forEach((cfg) => {
    game.settings.register(PTP, cfg.name, cfg.data);
  });
  // Add socket listener for delete events
  game.socket.on(`module.${PTP}`, (data) => {
    if (data.op === 'delete') handleDelete(data);
    if (data.op === 'status') handleStatus(data);
  });
  // Add delete listener
  $(document).keydown(deleteToken);
});

Hooks.once('ready', () => {
  canvas.tokens.requestStatus = requestStatus;
});
