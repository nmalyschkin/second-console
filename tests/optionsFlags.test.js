const { deepEqual } = require("assert");
const { encodeFlags, decodeFlags, defaultFlags } = require("../optionsFlags");

deepEqual(defaultFlags, decodeFlags(encodeFlags({})));
