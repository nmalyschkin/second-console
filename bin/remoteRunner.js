#! /usr/bin/env node

const { join } = require("path");
const startRemoteConsole = require("../startRemoteConsole");
const { createIPCPath, randomUniqueSocket } = require("../utils");

const parsedOptions = () => {
  const arguments = process.argv.slice(2);
  const options = {
    print: true,
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
        options.port = arguments.shift();
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

      case "-q":
      case "--quiet":
        options.print = false;
        break;

      default:
        throw new Error(`Unknown argument: ${nextArguemnt}`);
    }
  }

  if (!!options.seed + !!options.port + !!options.path > 1)
    throw new Error("Use only one of seed, port or path options");

  return options;
};

try {
  const { seed, port, path, help, print, ...options } = parsedOptions();

  const listenTo =
    port || path || (seed ? createIPCPath(seed) : randomUniqueSocket());

  if (help) {
    console.log("Help is on its way");
    process.exit(0);
  }

  if (print) {
    console.log();
    console.log(
      `
    const console = new (require("${join(__dirname, "..")}"))({ ${
        !!port ? "port" : "path"
      }:${listenTo} });`
    );
  }

  startRemoteConsole(listenTo, options);
} catch (error) {
  console.log();
  console.error(error.message);
  process.exit(1);
}
