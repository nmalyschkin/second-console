const { equal } = require("assert");
const { PassThrough } = require("stream");
const { createRequire } = require("../src/injectRequire");

test("injection test", async () => {
  const stream = new PassThrough();
  const con = new console.Console({
    stdout: stream,
  });

  const req = createRequire(con, __filename);
  req("./logging-test.js");

  for await (const inputBuffer of stream[Symbol.asyncIterator]()) {
    equal(inputBuffer.toString(), "injection test\n");
    break;
  }
});
