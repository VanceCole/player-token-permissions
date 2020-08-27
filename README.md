## Player Token Permissions Extended
A module for FoundryVTT that extends player permissions for controlling tokens:
- Lets you allow players to delete tokens
- Lets you create macros that assign or remove status effects to tokens

## Delete Tokens
- By default, players will be allowed to delete tokens they have ownership of by hovering and pressing Delete
- You can optionally allow deletion of targetted tokens instead or in addition to hovered
- Minimum token permission to delete is configurable by [Owned / Observer / Limited / Any]

## Status Effects
- Allows you to create macros to assign status effects, example:

```
let sel = canvas.tokens.controlled.map(t => t.id);
canvas.tokens.ptpSetStatus('icons/svg/skull.svg', sel)
```

## Limitations
- At least 1 GM player must be connected
- GM must be on the same scene as player
