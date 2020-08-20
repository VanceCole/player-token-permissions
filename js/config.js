export default [
  {
    name: 'delete',
    data: {
      name: 'Delete Tokens',
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
