const { exec } = require("child_process");
const { encodeFlags } = require("./optionsFlags");

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
exports.openExternalConsole = openExternalConsole;
