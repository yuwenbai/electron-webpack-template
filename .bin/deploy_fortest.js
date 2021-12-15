#!/usr/bin/env node
const exec = require("child_process").exec;
const path = require("path");
const PEPPA_APP_TYPE = "student";

const platform = process.platform;
const format = (pKey) =>
    Object.keys(pKey).reduce((r, k) => r + `--${k}=${pKey[k]} `, "");
const p = (i) => `${i}${path.sep}`;
const { PEPPA_ENV, CI_PROJECT_DIR, CI_JOB_ID } = process.env;

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
        `${CI_PROJECT_DIR}/dist/${PEPPA_ENV}/${PEPPA_APP_TYPE}`
    )}"`,
});

function getKeyPrefix() {
    if (platform == "darwin") {
        return `${PEPPA_ENV}/spark-programming-pc-${PEPPA_APP_TYPE}-signed-mac-fortest/${CI_JOB_ID}/`;
    } else {
        return `${PEPPA_ENV}/spark-programming-pc-${PEPPA_APP_TYPE}-signed-fortest/${CI_JOB_ID}/`;
    }
}

const command = `qshell qupload2 ${params}`;

console.log(command);

exec(command, (error, stdout, stderr) => {
    if (stdout) {
        console.log(stdout);
    }

    if (stderr) {
        console.error(stderr);
    }

    if (error) {
        console.error(error);
        process.exit(1);
    }
});
