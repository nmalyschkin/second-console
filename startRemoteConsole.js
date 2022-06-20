const { createServer } = require("net");

const startRemoteConsole = async (listenTo, params) => {
  const server = createServer((client) => {
    if (params.clearConsole) console.clear();
    client.on("data", (d) => process.stdout.write(d));

    if (!(params.wait || params.reconnect)) server.close();
  }).listen(listenTo);

  process.on("SIGINT", () => {
    server.close();
    process.exit();
  });
};

module.exports = startRemoteConsole;
