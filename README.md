# second console

External nodejs console for you outputs.

![example](https://user-images.githubusercontent.com/44928856/174535568-134b21ea-62d8-4f1a-b524-c762e152d21b.png)

## Quick Quick Start (no install)

```sh
npx second-console
```

Then copy/paste the code-snippet and you are already connected.

## Quick Start

```sh
npm i second-console
```

```js
const Console = require("../second-console");
const console = new Console({
  seed: "myAwesomeConsole",
});
```

This will automatically create a new terminal window for you and reconnect to the same window.
If you want to start the remote console yourself (e.g. in your IDE), just use `npx second-console` with the same parameters.

## ToDos

- write docs
- tests
- closing testing on all platforms
- test over the network
-

## (maybe) coming features

- browser support
- input support
- inject external console to modules via wrap function

## npx tool

- -s seed
- -p path
- -p port
- -r reconnect
- -c clear console on reconnect
