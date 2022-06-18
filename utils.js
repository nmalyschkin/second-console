const { readFile } = require("fs/promises");
const { createServer } = require("net");
const { tmpdir } = require("os");
const { promisify } = require("util");

/**
 * creates a random socket path to use in the os tmpdir
 * @returns string
 */
const randomUniqueSocket = () =>
  tmpdir() +
  "/node_second_console_" +
  Math.random().toString(36).substring(2).toUpperCase();

/**
 * Async waiting
 */
const sleep = promisify(setTimeout);

/**
 * checks if a given port is free for taking
 * @param {number} port
 * @returns {boolean}
 */
const isPortFree = (port) =>
  new Promise((res) => {
    const server = createServer();
    server.once("error", (err) => {
      res(false);
    });
    server.once("listening", () => {
      server.close(() => {
        res(true);
      });
    });
    server.listen(port);
  });

/**
 * Check whether a socket is already taken
 * @param {string} path
 * @returns
 */
const socketFileTaken = (path) =>
  readFile(path)
    .catch((err) => {
      return err.errno !== -2;
    })
    .finally((x) => !!x);

module.exports = {
  randomUniqueSocket,
  sleep,
  isPortFree,
  socketFileTaken,
};
