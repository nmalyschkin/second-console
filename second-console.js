const { exec } = require("child_process");
const { readFile } = require("fs/promises");
const { connect, createServer } = require("net");
const { PassThrough } = require("stream");
const { promisify } = require("util");
const { encodeFlags } = require("./optionsFlags");

const randomId = () => Math.random().toString(36).substring(2).toUpperCase();
const sleep = promisify(setTimeout);

/**
 * Opens up a new terminal window and executes the remote console there
 */
const openExternalConsole = (socketPath, options) => {
  exec(
    `osascript -e 'tell app "Terminal"
    do script " exec ${
      process.argv[0]
    } ${__dirname}/remote-console.js ${socketPath} ${encodeFlags(options)}"
end tell'`
  );
};

/**
 * Create a new external console
 */
class Console extends console.Console {
  constructor({ path, port, host, ...options }) {
    if (!!path === (!!port || !!host))
      throw new Error("Use either UDS or TCP/IP for second console connection");

    const stream = new PassThrough();
    super({
      stdout: stream,
      colorMode: true,
    });

    (async () => {
      let startExternalConsole = true;
      let connectParams;
      let externalParams;

      if (!(!!port || !!host)) {
        const socketPath = path || "/tmp/node_second_console_" + randomId();
        if (socketPath === path) {
          await readFile(socketPath).catch((err) => {
            startExternalConsole = err.errno === -2;
          });
        }
        connectParams = [socketPath];
        externalParams = socketPath;
      } else {
        connectParams = [port, host || "127.0.0.1"];
        externalParams = port;
        startExternalConsole = !!host
          ? false
          : await new Promise((res) => {
              const server = createServer();
              server.once("error", (err) => {
                res(false);
              });
              server.once("listening", () => {
                server.close(() => {
                  res(true);
                });
              });
              server.listen(port);
            });
      }
      if (startExternalConsole) {
        const flags = {
          ...options,
          reconnect: !!path,
        };
        openExternalConsole(externalParams, flags);
        await sleep(5000); // give the external console time to start;
      }
      const socket = connect(...connectParams, () => {
        stream.on("data", (str) =>
          socket.readyState === "closed"
            ? process.stdout.write(str)
            : socket.write(str)
        );
      });
      socket.unref();
    })();
  }

  clear() {
    this.log("\x1bc");
  }
}

module.exports = Console;
