/**
 * Just a simple binary flag encoding and decoding to make passing
 * flags from the main process to the external console easier
 */
const defaultFlags = {
  reconnect: false,
  wait: true,
  clearConsole: false,
};

const flagNames = Object.keys(defaultFlags);

const encodeFlags = (flags) => {
  const toBeEncoded = {
    ...defaultFlags,
    ...flags,
  };

  return flagNames.reduce(
    (acc, name, index) => acc + toBeEncoded[name] * 2 ** index,
    0
  );
};

const decodeFlags = (num) => {
  return flagNames.reduce((acc, name, index) => {
    acc[name] = Boolean(Math.floor(num / 2 ** index) % 2);
    return acc;
  }, {});
};

module.exports = {
  encodeFlags,
  decodeFlags,
  defaultFlags,
};
