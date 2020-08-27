export const PTP = 'player-token-permissions';

export const config = [
  {
    name: 'dPlayerType',
    data: {
      name: 'Delete Allowed For',
      hint: 'Which types of player should be allowed to delete?',
      scope: 'world',
      config: true,
      type: Number,
      default: 1,
      choices: {
        1: "Any Player",
        2: "Trusted Players Only",
      },
    },
  },
  {
    name: 'dPerm',
    data: {
      name: 'Delete Minimum Permission',
      hint: 'Which tokens should players be allowed to delete?',
      scope: 'world',
      config: true,
      type: Number,
      default: 3,
      choices: {
        3: "Owner",
        2: "Observer",
        1: "Limited",
        0: "Any"
      },
    },
  },
  {
    name: 'dHover',
    data: {
      name: 'Enable Hover Delete',
      hint: 'Should hovered tokens be deleted?',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    },
  },
  {
    name: 'dTarget',
    data: {
      name: 'Enable Target Delete',
      hint: 'Should targetted tokens be deleted?',
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    },
  },
  {
    name: 'sPlayerType',
    data: {
      name: 'Assign Status Allowed For',
      hint: 'Which types of player should be allowed to assign status effects?',
      scope: 'world',
      config: true,
      type: Number,
      default: 1,
      choices: {
        1: "Any Player",
        2: "Trusted Players Only",
      },
    },
  },
]
