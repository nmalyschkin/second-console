const encode = (obj, options) => JSON.stringify(obj);
const decode = (string, options) => JSON.parse(string);

module.exports = {
  encode,
  decode,
};
