const Module = require("module");

/**
 * creates a require function that injects the given console instance to loaded modules
 * ATTENTION: this will not work with imperative loaded submodules!
 *
 * @param {Console} console
 * @returns {Module.require}
 */
const createRequire = (console, __parent = module.parent.id) => {
  const require = (id) => {
    const _compile = Module.prototype._compile;
    globalThis["_node_second_console_injection_console"] = console;

    let _err;
    let response;

    try {
      Module.prototype._compile = function (content, filename) {
        return _compile.call(
          this,
          `(function (console, require) {
            ${content}
        })(
          globalThis["_node_second_console_injection_console"]
        )`,
          filename
        );
      };
      response = Module.createRequire(__parent)(id);
    } catch (error) {
      _err = error;
    }

    Module.prototype._compile = _compile;
    delete globalThis["_node_second_console_injection_console"];

    if (_err) throw _err;

    return response;
  };

  return require;
};

exports.createRequire = createRequire;
