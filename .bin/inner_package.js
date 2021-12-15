// // 获取最新版的包
// const { getPackageInfo } = require("@test/electron-package-manager");
// const getEtag = require("@test/electron-common/dist/common/qetag");
// const fse = require("fs-extra");
// const path = require("path");
// const got = require("got");
// const PEPPA_ENV = process.env.PEPPA_ENV;

// // 下载到static目录下
// // await AssetPackageManager.createDownloadTask({ id: APP_UI_ID, url, version, hash });

// async function downloadInnerPackage(APP_UI_ID, packagePath) {
//     console.log(
//         `开始下载内置H5包，APP_UI_ID：${APP_UI_ID}, 下载路径：${packagePath}`
//     );
//     fse.ensureFileSync(packagePath);
//     fse.removeSync(packagePath);
//     let result = "";
//     try {
//         let response = await getPackageInfo({
//             id: APP_UI_ID, // package id
//             channel: PEPPA_ENV, // online | sim | qa
//             tag: "stable", // stable | beta | alpha
//         });
//         result = JSON.parse(response.body);
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }

//     console.log(result);
//     const versionInfo = result.versions[0];
//     const { url, version, hash } = versionInfo;
//     const task = got(url, { encoding: null });
//     task.on("downloadProgress", (progress) => {
//         let { total, transferred, percent } = progress;
//         percent = parseFloat(percent.toFixed(2));
//         console.log(
//             `download ${APP_UI_ID}@${version} [${transferred}/${total}] - ${
//                 percent * 100
//             }%`
//         );
//     });
//     task.then((response) => {
//         return new Promise((resolve, reject) => {
//             if (hash) {
//                 getEtag(response.body, (value) => {
//                     if (value == hash) {
//                         console.log("文件校验一致");
//                         resolve(response);
//                     } else {
//                         reject(new Error("下载文件完整性校验失败"));
//                     }
//                 });
//             } else {
//                 console.log("不校验一致性");
//                 resolve(response);
//             }
//         });
//     })
//         .then((response) => {
//             fse.outputFileSync(packagePath, response.body);
//             console.log("文件下载完成");
//         })
//         .catch((error) => {
//             console.log("内置h5包下载出错");
//             throw error;
//         });
// }

// module.exports = downloadInnerPackage;
