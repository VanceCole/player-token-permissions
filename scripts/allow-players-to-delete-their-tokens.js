import { requestDelete, handleDelete, possiblyDeleteTokens } from './player-token-delete.js'

export const APTDTTModuleId = 'allow-players-to-delete-their-tokens'

Hooks.once('init', () => {
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
  $(document).keydown(possiblyDeleteTokens)
})

Hooks.once('ready', () => {
  // Add method to tokens layer
  canvas.tokens.requestDelete = requestDelete
})
