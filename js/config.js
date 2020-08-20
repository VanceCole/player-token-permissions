export default [
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
    name: 'select',
    data: {
      name: 'Enable Select Delete',
      hint: 'Should selected tokens be deleted?',
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
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
  {
    name: 'delete',
    data: {
      name: 'Delete Minimum Permission',
      hint: 'Which tokens should players be allowed to delete?',
      scope: 'world',
      config: true,
      type: String,
      default: "owner",
      choices: {
        3: "Owner",
        2: "Observer",
        1: "Limited",
        0: "Any"
      },
    },
  },
]
