const { exec } = require("child_process");
const { createServer } = require("net");
const { PassThrough } = require("stream");
const { promisify } = require("util");
const { encodeFlags } = require("./optionsFlags");

const generateId = () => Math.random().toString(36).substring(2).toUpperCase();
const sleep = promisify(setTimeout);
const openExternalConsole = (socketPath, options) => {
  exec(
    `osascript -e 'tell app "Terminal"
    do script " exec node ${__dirname}/remote-console.js ${socketPath} ${encodeFlags(
      options
    )}"
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

    let done;
    const connctionEstablished = new Promise((res) => {
      done = res;
    });
    const unixServer = createServer((client) => {
      done(true);
      stream.on("data", (str) =>
        client.readyState === "closed"
          ? process.stdout.write(str)
          : client.write(str)
      );
    });
    unixServer.unref();
    const socketPath = path || "/tmp/node_second_console_" + generateId();
    const flags = {
      ...options,
      reconnect: !!path,
    };
    unixServer.listen(socketPath, () => {
      Promise.race([connctionEstablished, sleep(1200).then(() => false)]).then(
        (consoleRunning) => {
          if (!consoleRunning) openExternalConsole(socketPath, flags);
        }
      );
    });

    process.on("SIGINT", () => {
      unixServer.close();
      process.exit();
    });
  }
}

module.exports = EConsole;
