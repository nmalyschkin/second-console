SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

osascript -e 'tell app "Terminal"
    do script "exec node '$SCRIPT_DIR'/remote-console.js"
end tell'