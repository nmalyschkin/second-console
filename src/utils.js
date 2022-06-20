const { readFile } = require("fs/promises");
const { createServer } = require("net");
const { tmpdir, type } = require("os");
const { join } = require("path");
const { promisify } = require("util");

/**
 * creates a random socket path to use in the os tmpdir
 * @returns string
 */
const randomUniqueSocket = () =>
  createIPCPath(
    "node_second_console_" +
      Math.random().toString(36).substring(2).toUpperCase()
  );

const createIPCPath = (seed) =>
  join(type() === "Windows_NT" ? "\\\\?\\pipe" : tmpdir(), seed);

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
const isIPCTaken = (path) =>
  readFile(path)
    .catch((err) => {
      return err.errno !== -2;
    })
    .finally((x) => !!x);

module.exports = {
  randomUniqueSocket,
  sleep,
  isPortFree,
  isIPCTaken,
  createIPCPath,
};
