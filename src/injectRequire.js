const Module = require("module");

/**
 * The problem with the imperative require could be solved if the require function would be injected to the scope similar to the console.
 * Unfortunately require is context sensitive, which makes this a little tricky but probably doable if needed.
 *
 * But there is a problem that is more difficult to solve, if not even impossible.
 * The created require also injects the console also in loaded sub-modules but what if those modules have been loaded before and are fetched from cache?
 * Example: Modules A and B require C which is offers functions that console.log something.
 * We load A with the default require and B with our injecting require.
 * If A is loaded first then C gets to cache without the injected console and calls from module B to C would also write to the default console.
 * If B is loaded first then C would get the injected console and calls from A would be also written to the injected console.
 * The solution might be to deactivate the cache for the injecting require all together (if possible) but this would most definitely interfer with module scoped
 * variables (e.g. Singletons).
 */

/**
 * creates a require function that injects the given console instance to loaded modules
 * ATTENTION: this will not work with imperative loaded submodules!
 *
 * @param {Console} console
 * @param {string} __parent pass __filename here
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
