const path = require("path");
const rimraf = require("rimraf");

const { CI_PROJECT_DIR } = process.env;
function getDistDir(dir = ".") {
  return path.resolve(`${dir}/dist/`);
}

const distDir = getDistDir(CI_PROJECT_DIR);
console.log("Remove directory path: ", distDir);
console.log(new Date(), "Del Start");
rimraf.sync(`${distDir}/*`); // ./dist/*
console.log(new Date(), "Del End");
