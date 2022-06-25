# second console &middot; ![npm](https://img.shields.io/npm/v/second-console) [![install size](https://packagephobia.com/badge?p=second-console)](https://packagephobia.com/result?p=second-console) ![dependencies](https://img.shields.io/badge/dependencies-none!-red) ![license](https://img.shields.io/npm/l/second-console)

<!-- ![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hd/second-console) -->

External nodejs console for you outputs.

![example](https://user-images.githubusercontent.com/44928856/174538853-8af9d728-0f21-4b9f-af1a-a5ce9a5875d0.png)

## Quick Quick Start (no install)

```sh
npx second-console
```

Copy/paste the code-snippet and you are already connected.

## Quick Start

```sh
npm i second-console
```

```js
const Console = require("second-console");
const console = new Console();
console.log(["Hello from remote!"]);
```

This will automatically create a new terminal window for you and reconnect to the same window.
If you want to start the remote console yourself (e.g. in your IDE), just use `npx second-console` with the same parameters.

## API

The created console has the same interface as the default [nodejs console](https://nodejs.org/dist/latest/docs/api/console.html).

```js
const Console = require("second-console");

const remoteConsole = new Console({
  // use either seed, path OR port
  seed: "<SEED>", // will create an IPC path at the correct location for you – recommended
  path: "/<MY>/<PATH>", // use with caution
  port: 8090, // use when seed is not working or you want to connect to a remote host

  // when using port, you can define a remote host by IP
  host: "192.168.178.22",

  //these will be passed to the remote consoled if open by your process
  reconnect: true, // when set to false, the remote console will not allow reconnections
  wait: true, // when wait and reconnect are set to false the remote console will terminate with you process
  clearConsole: false, // when set to true, the console will be cleared after every reconnect
});
```

### multiple inputs and outputs

So pratically multiple processes could share multiple remote consoles, where for example P1 and P2 both write to C1 and C2.
This could come in handy when you're running some network of workers and have multiple reporting channels.

Although this works you could encounter that some issues when two or more workers try to write big outputs on the same console.
Since the transmission is chunked and not properly ordered on the remote console, this could result in overlapping messages.

## Known issues

- Windows is making problems when we use the IPC channels for connection. If you're having troubles try using `npx second-console -p 9098` instead.
- WSL in itself works but is not (yet) intercomatible with Windows consoles. Maybe the external console needs to be started with `0.0.0.0` for host.
  IPC Channels between WSL and Windows is probably never going to work (at least in the forseeable future).
- WSL is not (yet) supporting automatic start of an external console. This is probably fixable.

## Use-cases

Here are some use-cases I had in mind. (howtos coming soon)

### Something is spaming your stdout

Haven't we all been there when you just want to debug some code with `console.log(whyAreYouFalse)` and winston or some other module is just spaming logs.

At this point you can:

- disable the spaming code (good luck finding it)
- `console.log("\n\n\n\n\n\n", { hahaFindMe }, "\n\n\n\n\n\n\n\n")`
- second-console

### Combining outputs from a worker network

When working with a network of workers it can be handy to have them write their results or issues to a common console, especially when you're running over 200 in a LAN.

### console.log/stdout is disabled

Been there, done that – waisting not just time but also my precious sanity.

### developing nodejs in docker (or over physical network)

Yeah, you can `docker logs -f myCuntainer` but you don't have time to type that every time!

### outsource debug logs

Just outsource these badboys to an external console and have a nice day.

## using in production

Could you? -> Sure! <br>
Should you? -> Probably not

## (maybe) coming features

- browser support
- input support
- inject external console to modules via wrap function
- close() function

## Contribution

Open for suggestions, issues and PRs.

## ToDos

- tests
- closing testing on all platforms
- test over the network
