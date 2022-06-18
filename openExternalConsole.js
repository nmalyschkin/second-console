const { exec } = require("child_process");
const { type } = require("os");
const { encodeFlags } = require("./optionsFlags");

/**
 * Opens up a new terminal window and executes the remote console there
 */
const openExternalConsole = (socketPath, options) => {
  switch (type()) {
    case "Windows_NT":
      exec(
        `start powershell { & '${
          process.argv[0]
        }' '${__dirname}\remote-console.js' ${socketPath} ${encodeFlags(
          options
        )}}`,
        { shell: "powershell.exe" }
      );
      break;

    case "Darwin":
      exec(
        `osascript -e 'tell app "Terminal"
        do script " exec ${
          process.argv[0]
        } ${__dirname}/remote-console.js ${socketPath} ${encodeFlags(options)}"
    end tell'`
      );
      break;

    case "Linux":
    default:
      exec(
        `gnome-terminal --window -e "${
          process.argv[0]
        } ${__dirname}/remote-console.js ${socketPath} ${encodeFlags(options)}"`
      );
      break;
  }
};

exports.openExternalConsole = openExternalConsole;
