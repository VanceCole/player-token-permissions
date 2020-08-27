# Player Token Permissions Extended
A module for FoundryVTT that extends player permissions for controlling tokens:
- Lets you allow players to delete tokens
- Lets you create macros toggle status / overlay effects to tokens

## Delete Tokens
- By default, players will be allowed to delete tokens they have ownership of by hovering and pressing Delete
- You can optionally allow deletion of targetted tokens instead or in addition to hovered
- By default players can only delete owned tokens, you can configure permissions to instead allow [Owned / Observer / Limited / Any]
- Configure to allow this ability for Trusted (default) or all players

## Toggle Status Effects
- Allows you to create macros to toggle status effects
- Configure to allow this ability for Trusted (default) or all players
- For convenience, this function will also work if you are a GM
- Select between regular effect (default) or larger overlay effect
- State can toggle (default) or force enabled / disabled

Adds a requestStatus() function to the canvas.tokens object:
```js
/**
 * Requests status effect be assigned to the given tokens
 * - If user is GM, it will be assigned directly
 * - Otherwise it will send socket request to a GM to do so
 * @param {String}  img              The image URL to apply
 * @param {Array}   tokens           Array of tokens to be assigned to
 * @param {Object}  {options}        Configuration options which control how to assign
 *                                     the status effect
 * @param {Boolean} options.overlay  If true, will assign as larger overlay effect
 * @param {Boolean} options.state    null = toggle, true = enabled, false = disabled
 * @example
 * requestStatus('icons/svg/fire.svg', ['<token-id>'], { overlay: false, state: true });
 */
```

### Example macros

```js
// Toggle fire icon condition for selected tokens
let sel = canvas.tokens.controlled.map(t => t.id);
canvas.tokens.requestStatus('icons/svg/fire.svg', sel);
```
```js
// Toggle net icon condition as overlay (large) for targetted tokens
let sel = game.user.targets.ids;
canvas.tokens.requestStatus('icons/svg/net.svg', sel, { overlay: true });
```
```js
// Enable holy shield icon for character Steve's token
let sel = canvas.tokens.placeables.find(t => t.name === 'Steve').id;
canvas.tokens.requestStatus('icons/svg/holy-shield.svg', sel, { state: true });
```
```js
// Disable any poison icons for targetted tokens
let sel = game.user.targets.ids;
canvas.tokens.requestStatus('icons/svg/poison.svg', sel, { state: false });
```

## Limitations
- At least 1 GM player must be connected
- GM must be on the same scene as player
