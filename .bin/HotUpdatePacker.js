/**
 * 热更新资源打包
 */

import fs from 'fs-extra'
import asar from 'asar'
import path from 'path'
import archiver from 'archiver'
import crypto from 'crypto'
const PackageJSON = require("../package.json");
// import gConf from '../../app/renderer/dist/__config.js'

const DES_DIR = './release/hot-update'
const RES_DIR = DES_DIR + '/res'
const SRC_DIR = './src'
const ASAR_FILE = SRC_DIR + `/res_${PackageJSON.version}.asar`
const OUTPUT_ASAR = DES_DIR + `/res_${PackageJSON.version}.asarfile`
const OUTPUT_FILE_NAME = `app_student_${PackageJSON.version}.zip`
const INSTALL_FILE_NAME = `Spark_client-${PackageJSON.version}`
const OUTPUT_FILE = `./release/${OUTPUT_FILE_NAME}`

let argName = process.argv[2]

if (argName === 'pack-res-asar') {
  // 打asar资源包
  packageResAsar()
} else {
  // 打热更新包
  packageAppZip()
}

function packageResAsar() {
  console.log('remove asar files...')
  let fileList = fs.readdirSync(SRC_DIR)
  fileList.forEach(function (filename) {
    let file = SRC_DIR + '/' + filename
    // let stat = fs.statSync(file);
    let ext = path.extname(filename)
    if (ext === '.asar') {
      fs.removeSync(file)
    }
  })

  console.log('package res files to asar...')
  fs.emptyDirSync(RES_DIR)
  fs.copySync(SRC_DIR + '/dist', RES_DIR + '/dist')
  fs.copySync(SRC_DIR + '/renderer/app.html', RES_DIR + '/app.html')

  asar.createPackage(RES_DIR, ASAR_FILE, function () {
    console.log('create asar done: ' + ASAR_FILE)
    process.exit(0)
  })
  console.log('package res files to asar... version ', PackageJSON.version)
}

function packageAppZip() {
  // empty dir
  console.log('empty dir: ' + DES_DIR)
  fs.emptyDirSync(DES_DIR)

  // copy files
  console.log('copy files...')
  fs.copySync(ASAR_FILE, OUTPUT_ASAR)
  fs.copySync(SRC_DIR + '/package.json', DES_DIR + '/package.json')

  // package zip
  var output = fs.createWriteStream(OUTPUT_FILE)
  output.on('close', function () {
    console.log('create res package done: ' + OUTPUT_FILE)
    // create upgrade.json
    readFileMd5(OUTPUT_FILE).then((md5String) => {
      fs.writeJsonSync(
        './release/upgrade.json',
        {
          version: PackageJSON.version,
          md5: md5String,
          updateMain: argName === 'update-main',
          releaseName: 'force-update',
          releaseNotes: '',
        },
        { spaces: 2 }
      )
    })
  })

  var archive = archiver('zip', {
    zlib: { level: 9 }, // 压缩级别是一个0-9的数字，0压缩速度最快（压缩的过程），9压缩速度最慢，压缩率最大，0不压缩数据
  })
  archive.pipe(output)
  archive.directory(DES_DIR)
  archive.finalize()
}

let readFileMd5 = (url) => {
  return new Promise((reslove) => {
    let md5sum = crypto.createHash('md5')
    let stream = fs.createReadStream(url)
    stream.on('data', function (chunk) {
      md5sum.update(chunk)
    })
    stream.on('end', function () {
      let fileMd5 = md5sum.digest('hex')
      reslove(fileMd5)
    })
  })
}
