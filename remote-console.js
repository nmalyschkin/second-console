const { defaultFlags, decodeFlags } = require("./optionsFlags");
const startRemoteConsole = require("./startRemoteConsole");

let params = defaultFlags;
try {
  params = decodeFlags(Number(process.argv[3]));
} catch (e) {}

console.clear();
startRemoteConsole(process.argv[2], params);
