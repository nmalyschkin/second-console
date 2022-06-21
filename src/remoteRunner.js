#! /usr/bin/env node

const { type } = require("os");
const { join } = require("path");
const startRemoteConsole = require("./startRemoteConsole");
const { createIPCPath, randomUniqueSocket } = require("./utils");

const helpText = `
second-console creates a remote console for you JS application

usage:
npx second-console -s <SEED>
npx second-console -p <PORT>
npx second-console --path <PATH>

options:
  -q,--quiet  start the console quitely
  -c,--clear  clear the console on reconnection
  -e,--exit   exit the console when the application disconnects
  -v,--version  print the executing second-console versions

help:
https://github.com/nmalyschkin/second-console (${
  type() === "Darwin" ? "⌘" : "ctrl"
} + click)`;

const parsedOptions = () => {
  const arguments = process.argv.slice(2);
  const options = {
    print: true,
    reconnect: true,
  };

  while (arguments.length) {
    const nextArguemnt = arguments.shift();
    switch (nextArguemnt) {
      case "-s":
      case "--seed":
        if (!arguments.length) throw new Error("missing seed parameter");
        options.seed = arguments.shift();
        break;

      case "-p":
      case "--port":
        if (!arguments.length) throw new Error("missing port parameter");
        options.port = Number(arguments.shift());
        if (isNaN(options.port)) throw new Error("port must be a number");
        break;

      case "--path":
        if (!arguments.length) throw new Error("missing path parameter");
        options.path = arguments.shift();
        break;

      case "-e":
      case "--exit":
        options.reconnect = false;
        options.wait = false;
        break;

      case "-c":
      case "--clear":
        options.clearConsole = true;
        break;

      case "-h":
      case "--help":
        options.help = true;
        break;

      case "-v":
      case "--version":
        options.version = true;
        break;

      case "-q":
      case "--quiet":
        options.print = false;
        break;

      default:
        if (/^-\w{2,}$/.test(nextArguemnt)) {
          const compoundArguments = nextArguemnt
            .substring(1)
            .split("")
            .map((letter) => "-" + letter);
          arguments.push(...compoundArguments);
        } else throw new Error(`Unknown argument: ${nextArguemnt}`);
    }
  }

  if (!!options.seed + !!options.port + !!options.path > 1)
    throw new Error("Use only one of seed, port or path options");

  return options;
};

try {
  const { seed, port, path, help, print, version, ...options } =
    parsedOptions();

  const listenTo =
    port || path || (seed ? createIPCPath(seed) : randomUniqueSocket());

  if (help) {
    console.log(helpText);
    process.exit(0);
  }

  if (version) {
    const { version: ver } = require("../package.json");
    console.log(`second-console v${ver}`);
  }

  if (print) {
    console.group("\x1b[4mcopy this to your code or REPL\x1b[0m");
    console.log(
      `\x1b[1mconst console = new (require(${JSON.stringify(
        join(__dirname, "..")
      )}))({ ${!!port ? "port" : "path"}:${JSON.stringify(listenTo)} });\x1b[0m`
    );
    console.groupEnd();
  }

  startRemoteConsole(listenTo, options);
} catch (error) {
  console.log();
  console.error(error.message);
  process.exit(1);
}
