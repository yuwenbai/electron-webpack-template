const request = require('superagent')
const os = require('os')
const PackageJSON = require('../package.json')

const server = 'https://nm.qa.test.cn/package/add_v2' // ?这个
const name = 'spark-programming-pc'
const description = '版本更新了，请下载'
const buildNumber = process.env.CI_JOB_ID || 0
// const version = PackageJSON.version + '.' + buildNumber

const platform = {
  darwin: 'macOS',
  win32: 'Windows',
}[os.platform()]

const PEPPA_ENV = process.env.PEPPA_ENV
const CI_JOB_ID = process.env.CI_JOB_ID || 0

const setDownloadUrl = () => {
  return new Promise((res, rej) => {
    request
      .post(server)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        env: PEPPA_ENV,
        platform: platform,
        name: name,
        version: getVersion(),
        url: downloadUrl,
        build: buildNumber,
        description: description,
      })
      .end((err, resp) => {
        if (err) {
          console.log('上传文件下载地址失败')
        } else {
          console.log('上传文件下载地址成功')
        }
        err ? rej(err) : res(resp.body.data)
      })
  })
}

function getVersion() {
  let tempVersion = PackageJSON.version
  if (PEPPA_ENV == 'qa') {
    return `${tempVersion}-alpha.${buildNumber}`
  }

  if (PEPPA_ENV == 'sim') {
    return `${tempVersion}-beta.${buildNumber}`
  }
  return tempVersion
}

function getProductName() {
  let envSurffix = {
    qa: ' - QA版',
    sim: ' - SIM版',
    online: '',
  }[PEPPA_ENV]
  return `火${envSurffix}`
}

function getExtension() {
  if (platform == 'macOS') {
    return `.dmg`
  } else {
    return `.exe`
  }
}

function getPublishURL() {
  let fortest = `/${CI_JOB_ID}`
  if (PEPPA_ENV === 'qa' || PEPPA_ENV === 'sim') {
    fortest = `-fortest/${CI_JOB_ID}`
  }
  let url = ''
  if (platform == 'macOS') {
    url = `https://img.txqn.test.cn/${PEPPA_ENV}/spark-programming-pc-student-signed-mac${fortest}/`
  } else {
    url = `https://img.txqn.test.cn/${PEPPA_ENV}/spark-programming-pc-student-signed${fortest}/`
  }
  // console.log(' getPublishURL url ', url)
  return url
}

let downloadUrl = `${getPublishURL()}${getProductName()}-${getVersion()}${getExtension()}`

console.log(downloadUrl)

setDownloadUrl()
