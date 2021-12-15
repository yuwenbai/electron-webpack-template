#!/usr/bin/env node
const exec = require("child_process").exec;
const path = require("path");
const PEPPA_APP_TYPE = "student";
const PackageJSON = require("../package.json");

const platform = process.platform;

const format = (p) => Object.keys(p).reduce((r, k) => r + `-${k}=${p[k]} `, "");
const p = (i) => `${i}${path.sep}`;
const { PEPPA_ENV, CI_PROJECT_DIR } = process.env;
if (!PEPPA_ENV) {
    throw new Error("PEPPA_ENV is not defined");
}

// if (!CI_PROJECT_DIR) {
//     throw new Error("CI_PROJECT_DIR is not defined");
// }

const params = format({
    "thread-count": 10,
    bucket: "test",
    "rescan-local": "true",
    overwrite: "true",
    "skip-path-prefixes": [
        p("mac"),
        p("win-unpacked"),
        p("win-ia32-unpacked"),
        p(".icon-icns"),
        p(".icon-ico"),
    ].join(","),
    "key-prefix": getKeyPrefix(),
    "src-dir": `"${path.resolve(
        `./release/app_student_${PackageJSON.version}.zip`
    )}"`,
});

function getKeyPrefix() {
    // if (platform == "darwin") {
    //     return `${PEPPA_ENV}/spark-programming-pc-${PEPPA_APP_TYPE}-signed-mac/`;
    // } else {
    //     return `${PEPPA_ENV}/spark-programming-pc-${PEPPA_APP_TYPE}-signed/`;
    // }
    return `app_student_${PackageJSON.version}.zip`
}

// const command = `qshell qupload2 ${params}`;

console.log(params);

// exec(command, (error, stdout, stderr) => {
//     if (stdout) {
//         console.log(stdout);
//     }

//     if (stderr) {
//         console.error(stderr);
//     }

//     if (error) {
//         console.error(error);
//         process.exit(1);
//     }
// });
