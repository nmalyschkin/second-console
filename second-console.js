const { connect } = require("net");
const { PassThrough } = require("stream");
const { openExternalConsole } = require("./openExternalConsole");
const {
  randomUniqueSocket,
  sleep,
  isPortFree,
  isIPCTaken,
  createIPCPath,
} = require("./utils");

/**
 * Create a new external console
 */
class Console extends global.console.Console {
  constructor({ path, port, host, ...options } = {}) {
    if (!!path && (!!port || !!host))
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

      // depending on connection type prepare parameters for connection
      // and determine whether to spin up an external console
      if (!(!!port || !!host)) {
        // UDS
        const socketPath = path || randomUniqueSocket();
        if (socketPath === path) {
          startExternalConsole = !(await isIPCTaken(socketPath));
        }
        connectParams = [socketPath];
        externalParams = socketPath;
      } else {
        // TCP/IP
        connectParams = [port, host || "127.0.0.1"];
        externalParams = port;
        startExternalConsole = !!host ? false : await isPortFree(port);
      }

      // start an external console if needed
      if (startExternalConsole) {
        const flags = {
          ...options,
          reconnect: !!path,
        };
        openExternalConsole(externalParams, flags);
        await sleep(1000); // give the external console time to start;
      }

      // create connection and pipe the stream into it
      const socket = connect(...connectParams, () => {
        stream.on("data", (str) =>
          socket.readyState === "closed"
            ? process.stdout.write(str)
            : socket.write(str)
        );
      });
      socket.unref(); // so the socket does not keep our process from exiting
    })();
  }

  clear() {
    this.log("\x1bc");
  }
}

Console.createIPCPath = createIPCPath;

module.exports = Console;
