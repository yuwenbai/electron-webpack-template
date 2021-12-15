const request = require("superagent");
const os = require("os");
const PackageJSON = require("../package.json");
const PEPPA_APP_TYPE = "student";
const server =
    process.env.PEPPA_ENV === "qa" ? "m.qa.test.cn" : "m.sim.test.cn";
const appUniqId = "cn.test.programming";
const description = "版本更新了，请下载";
// const downloadUrl = "http://www.test.cn";
const PEPPA_ENV = process.env.PEPPA_ENV
const CI_JOB_ID = process.env.CI_JOB_ID || 0;
// const version = PackageJSON.version + "." + CI_JOB_ID;
const version = PackageJSON.version; //去掉版本号
const platform = {
    darwin: "macOS",
    win32: "Windows",
}[os.platform()];
// const platform = process.env.PEPPA_PLATFORM || process.platform; // TODO
const forceVersion = "2.1.1" + "." + (parseInt(CI_JOB_ID) - 1); // ? 这个
const optionVersion = PackageJSON.version + "." + (parseInt(CI_JOB_ID) - 1);
const showBuy = 0;


// function getVersion () {
//     let tempVersion = PackageJSON.version;
//     if (PEPPA_ENV == 'qa') {
//         return `${tempVersion}-alpha.${buildNumber}`;
//     }

//     if (PEPPA_ENV == 'sim') {
//         return `${tempVersion}-beta.${buildNumber}`;
//     }
//     return tempVersion;
// }

// function getProductName () {
//     let envSurffix = {
//         'qa': ' - QA版',
//         'sim': ' - SIM版',
//         'online': '',
//     }[PEPPA_ENV];
//     return `火${envSurffix}`;
// }

// function getExtension () {
//     if (platform == 'macOS') {
//         return `.dmg`;
//     } 
//     else {
//         return `.exe`;
//     } 
// }


function getPublishURL () {
    let fortest = '';
    // if (PEPPA_ENV === 'online') {
    //     fortest= `-fortest/${CI_JOB_ID}`
    // }
    // fortest= `-fortest/${CI_JOB_ID}`
    // if (platform == 'macOS') {
    //     return `https://img.txqn.test.cn/${PEPPA_ENV}/peppa-app-pc-student-signed-mac${fortest}/`;
    // } 
    // else {
    //     return `https://img.txqn.test.cn/${PEPPA_ENV}/peppa-app-pc-student-signed${fortest}/`;
    // }
    
    if (platform == "macOS") {
        return `https://img.txqn.test.cn/${PEPPA_ENV}/spark-programming-pc-${PEPPA_APP_TYPE}-signed-mac-fortest/${CI_JOB_ID}/`;
    } else {
        return `https://img.txqn.test.cn/${PEPPA_ENV}/spark-programming-pc-${PEPPA_APP_TYPE}-signed-fortest/${CI_JOB_ID}/`;
    }
}

let downloadUrl = `${getPublishURL()}`

const setOptional = () => {
    return new Promise((res, rej) => {
        request
            .post(`http://${server}/api/versions`)
            .set("accept", "*/*")
            .set("content-type", "application/json")
            .send({
                appUniqId,
                platform,
                version,
                description,
                downloadUrl,
                showBuy,
                forceVersion,
                optionVersion,
            })
            .end((err, resp) => {
                err ? rej(err) : res(resp.body.data);
                console.log('设置完成')
            });
    });
};
setOptional();
