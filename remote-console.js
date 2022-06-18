const { readFile } = require("fs/promises");
const { connect } = require("net");
const { promisify } = require("util");
const { defaultFlags, decodeFlags } = require("./optionsFlags");

const sleep = promisify(setTimeout);

let params = defaultFlags;
try {
  params = decodeFlags(Number(process.argv[3]));
} catch (e) {}

// prevent console from closing, when it was executed as a stand alone terminal
if (params.wait) setInterval(() => {}, 3600);

(async () => {
  console.clear();

  do {
    try {
      await readFile(process.argv[2]).catch((err) => {
        if (err.errno === -2) throw new Error("missing socket");
      });

      const socket = connect(process.argv[2]);

      if (params.clearConsole) console.log("\033[2J");
      socket.on("data", (d) => process.stdout.write(d));

      await new Promise((res) => {
        socket.on("close", () => {
          res();
        });
      });
    } catch (error) {
    } finally {
      await sleep(500);
    }
  } while (params.reconnect);
})();

// (async () => {
//   do {
//     await sleep(1000);
//   } while (true);
// })();
