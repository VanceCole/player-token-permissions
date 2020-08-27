export default [
  {
    name: 'playerType',
    data: {
      name: 'Delete Enabled',
      hint: 'Which types of player should be allowed to delete?',
      scope: 'world',
      config: true,
      type: Number,
      default: 1,
      choices: {
        0: "Any Player",
        1: "Trusted Players Only",
      },
    },
  },
  {
    name: 'delete',
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
    name: 'hover',
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
    name: 'target',
    data: {
      name: 'Enable Target Delete',
      hint: 'Should targetted tokens be deleted?',
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    },
  },
]
