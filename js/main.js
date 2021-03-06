import { config, PTP } from './config.js';
import { requestDelete, handleDelete, deleteToken } from './player-token-delete.js';
import { requestStatus, handleStatus } from './player-token-status.js';
import { warn } from './helpers.js';

Hooks.once('init', () => {
  // Register settings
  config.forEach((cfg) => {
    game.settings.register(PTP, cfg.name, cfg.data);
  });
  // Add socket listener for delete events
  game.socket.on(`module.${PTP}`, (data) => {
    if (data.op === 'delete') handleDelete(data);
    else if (data.op === 'status') handleStatus(data);
    else if (data.op === 'warn') warn(data);
  });
  // Add delete listener
  $(document).keydown(deleteToken);
});

Hooks.once('ready', () => {
  // Add method to tokens layer
  canvas.tokens.requestStatus = requestStatus;
  canvas.tokens.requestDelete = requestDelete;
});
