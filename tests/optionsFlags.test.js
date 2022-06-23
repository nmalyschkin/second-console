const assert = require("assert");
const {
  encodeFlags,
  decodeFlags,
  defaultFlags,
} = require("../src/optionsFlags");

test("optionFlags default", () => {
  assert.deepEqual(defaultFlags, decodeFlags(encodeFlags({})));
});
