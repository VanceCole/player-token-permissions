import { requestDelete, handleDelete, possiblyDeleteTokens } from './player-token-delete.js'

export const APTDTTModuleId = 'allow-players-to-delete-their-tokens'

Hooks.once('init', () => {
  if (isNewerVersion(game.version, '10')) {
    return
  }
  // Add socket listener for delete events
  game.socket.on(`module.${APTDTTModuleId}`, (data) => {
    if (data.op === 'delete') {
      handleDelete(data)
    }
    else if (data.op === 'warn') {
      if (data.user === game.user.id) {
        ui.notifications.warn(data.msg)
      }
    }
  })
  // Add delete listener
  $(document)
    .keydown(possiblyDeleteTokens)
})

Hooks.once('ready', () => {
  if (isNewerVersion(game.version, '10')) {
    if (game.user.isGM) {
      ui.notifications.info(`The module "Allow Players To Delete Their Tokens" is now obsolete!
      Since Foundry V10, you can simply grant players the "Delete Tokens" permission.
      Please uninstall this module, as it no longer does anything.  Enjoy your game!`,
        { permanent: true })
    }
    return
  }
  // Add method to tokens layer
  canvas.tokens.requestDelete = requestDelete
})
