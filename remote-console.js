const { createServer } = require("net");
const { defaultFlags, decodeFlags } = require("./optionsFlags");

let params = defaultFlags;
try {
  params = decodeFlags(Number(process.argv[3]));
} catch (e) {}

(async () => {
  console.clear();

  const server = createServer((client) => {
    if (params.clearConsole) console.clear();
    client.on("data", (d) => process.stdout.write(d));

    if (!(params.wait || params.reconnect)) server.close();
  }).listen(process.argv[2]);

  process.on("SIGINT", () => {
    server.close();
    process.exit();
  });
})();
