#!/usr/bin/env node
const { promisify } = require("util");
const Console = require("../second-console");

const console = new Console({
  path: Console.createIPCPath("test"),
});

const sleep = promisify(setTimeout);
(async () => {
  while (true) {
    await sleep(1000);
  }
})();

(async () => {
  console.log("log this remotely");
  console.log(["log this remotely"]);
  console.log(() => {});
  console.time("asd");
  await sleep(1000);
  console.timeEnd("asd");
  // console.clear();
  console.table(["apples", "oranges", "bananas"]);
  console.error("test");
  console.trace("traces work too");
})();
