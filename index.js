#!/usr/bin/env node
const { promisify } = require("util");
const EConsole = require("./second-console");

const c = new EConsole({
  wait: true,
  reconnect: true,
  path: "/tmp/test",
});

const sleep = promisify(setTimeout);
(async () => {
  console.clear();
  while (true) {
    await sleep(1000);
  }
})();

(async () => {
  c.log("log this remotely");
  c.log(["log this remotely"]);
  c.log(() => {});
  c.time("asd");
  await sleep(1000);
  c.timeEnd("asd");
  c.clear();
  c.table(["apples", "oranges", "bananas"]);
  c.error("test");
  c.trace("traces work too");

  await sleep(5000);
  c.error("test");
})();

(async () => {
  const c = console;
  c.log("log this remotely");
  c.log(["log this remotely"]);
  c.log(() => {});
  c.time("asd");
  await sleep(1000);
  c.timeEnd("asd");
})();
