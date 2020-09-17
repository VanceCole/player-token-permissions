export function warn(data) {
  if (data.user !== game.user.id) return;
  ui.notifications.warn(data.msg);
}

export function gmActive() {
  return (!!game.users.filter((u) => u.active && u.isGM).length);
}
