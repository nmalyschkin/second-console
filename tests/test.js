const { join } = require("path");

const tests = [];

const run = async () => {
  const failedTests = [];

  for (const t of tests) {
    try {
      await t.func();
      console.log("✅", t.name);
    } catch (e) {
      failedTests.push(t.name);
      console.log("❌", t.name);
      console.log(e.stack);
    }
  }

  console.log();
  console.log(
    `${tests.length - failedTests.length}/${
      tests.length
    } tests finished successfully`
  );
  if (failedTests.length) {
    console.group("failed tests:");
    failedTests.forEach((t) => console.log(`- ${t}`));
    console.groupEnd();
    process.exit(1);
  }
};

global.test = function (name, func) {
  tests.push({ name, func });
};

process.argv.slice(2).forEach((testFile) => {
  require(join(__dirname, "..", testFile));
});

delete global.test;

run();
