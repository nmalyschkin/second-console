const { exec } = require("child_process");
const { readFile } = require("fs/promises");
const { connect } = require("net");
const { PassThrough } = require("stream");
const { promisify } = require("util");
const { encodeFlags } = require("./optionsFlags");

const generateId = () => Math.random().toString(36).substring(2).toUpperCase();
const sleep = promisify(setTimeout);
const openExternalConsole = (socketPath, options) => {
  exec(
    `osascript -e 'tell app "Terminal"
    do script " exec ${
      process.argv[0]
    } ${__dirname}/remote-console.js ${socketPath} ${encodeFlags(options)}"
end tell'`
  );
};

class EConsole extends console.Console {
  constructor({ path, ...options }) {
    const stream = new PassThrough();
    super({
      stdout: stream,
      colorMode: true,
    });

    (async () => {
      const socketPath = path || "/tmp/node_second_console_" + generateId();

      let startExternalConsole = true;
      if (socketPath === path) {
        await readFile(socketPath).catch((err) => {
          startExternalConsole = err.errno === -2;
        });
      }
      if (startExternalConsole) {
        const flags = {
          ...options,
          reconnect: !!path,
        };
        openExternalConsole(socketPath, flags);
        await sleep(1000); // give the external console time to start;
      }
      const socket = connect(socketPath, () => {
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

module.exports = EConsole;
