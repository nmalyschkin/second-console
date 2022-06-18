const assert = require("assert");
const { encodeFlags, decodeFlags, defaultFlags } = require("../optionsFlags");

assert.deepEqual(defaultFlags, decodeFlags(encodeFlags({})));
