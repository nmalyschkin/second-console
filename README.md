# second console &middot; ![npm](https://img.shields.io/npm/v/second-console) ![npm bundle size](https://img.shields.io/bundlephobia/min/second-console) ![dependencies](https://img.shields.io/badge/dependencies-none!-red) ![license](https://img.shields.io/npm/l/second-console)

<!-- ![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hd/second-console) -->

External nodejs console for you outputs.

![example](https://user-images.githubusercontent.com/44928856/174538853-8af9d728-0f21-4b9f-af1a-a5ce9a5875d0.png)

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
const Console = require("second-console");
const console = new Console({
  seed: "myAwesomeConsole",
});
```

This will automatically create a new terminal window for you and reconnect to the same window.
If you want to start the remote console yourself (e.g. in your IDE), just use `npx second-console` with the same parameters.

## ToDos

- write docs
- add close() functionality to expicitly close the console (test whether unrev is already closing the socket when running out of scope)
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
