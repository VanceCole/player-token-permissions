import { APTDTTModuleId } from './allow-players-to-delete-their-tokens.js'

function gmActive () {
  return (!!game.users.filter((u) => u.active && u.isGM).length)
}

/**
 * Requests tokens be deleted
 * - If user is GM, it will be deleted directly
 * - Otherwise it will send socket request to a GM to do so
 * @param {Array|String}  ids     Token IDs to be deleted
 * @example
 * requestDelete(['<token-id>']);
 */
export function requestDelete (ids) {
  const tokenIds = (typeof ids === 'string') ? [ids] : ids
  if (!tokenIds.length) return
  if (!gmActive()) {
    const pluralS = tokenIds.length === 1 ? '' : 's'
    ui.notifications.warn(`Could not delete ${tokenIds.length} token${pluralS} because there is no GM connected.`)
    return
  }
  if (game.user.isGM) {
    // If user is gm, just delete directly
    canvas.scene.deleteEmbeddedDocuments('Token', tokenIds)
    return
  }
  // If not gm, request deletion via socket, after confirmation
  const emitViaSocket = () => {
    // Request GM user to delete tokens
    game.socket.emit(`module.${APTDTTModuleId}`, {
      op: 'delete',
      user: game.user.id,
      scene: canvas.scene.id,
      tokens: tokenIds,
    })
    // eslint-disable-next-line no-console
    console.log(`${APTDTTModuleId} | Requesting GM delete tokens ${JSON.stringify(tokenIds)} from scene ${canvas.scene.id}`)
  }
  if (game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)) {
    emitViaSocket()
  }
  else {
    promptConfirmation(tokenIds, emitViaSocket)
  }
}

const promptConfirmation = (tokenIds, emitViaSocket) => {
  const pluralS = tokenIds.length === 1 ? '' : 's'
  new Dialog({
    title: `Delete your token${pluralS}?`,
    content: `<p>Are you sure you want to delete your token${pluralS}?</p>
<p>Token name${pluralS}: ${tokenIds.map(tId => canvas.tokens.get(tId)?.name)
      .join(', ')}</p>
<p>(You can hold Shift to skip this confirmation prompt)</p>`,
    buttons: {
      ok: {
        label: `Delete token${pluralS}`,
        icon: `<i class="fas fa-check"></i>`,
        callback: emitViaSocket,
      },
      cancel: {
        label: 'Cancel',
        icon: `<i class="fas fa-times"></i>`,
        callback: () => {},
      },
    },
    default: 'ok',
  }).render(true)
}

/*
 * React to keyboard events and if delete requested, process and emit socket event
 */
export function possiblyDeleteTokens (e) {
  // Only react on delete key
  if (e.which !== 46) return
  // Do not react if game is not target
  if (!e.target.tagName === 'BODY') return
  // Only react if token layer is active
  if (ui.controls.activeControl !== 'token') return
  // Do not react if user is a GM
  if (game.user.isGM) return

  // Tokens to be deleted - controlled tokens
  const tokens = canvas.tokens.controlled

  if (!tokens.length) return
  requestDelete(tokens.map(t => t.id))
}

/*
 * Handles incoming socket delete request
 */
export function handleDelete (data) {
  // eslint-disable-next-line no-console
  console.log(`${APTDTTModuleId} | Player ${data.user} requests delete tokens ${JSON.stringify(data.tokens)} from scene ${data.scene}`)
  const scene = game.scenes.get(data.scene)
  scene.deleteEmbeddedDocuments('Token', data.tokens)
}
