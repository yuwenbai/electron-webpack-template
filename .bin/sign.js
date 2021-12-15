// const PEPPA_PLATFORM = process.env.PEPPA_PLATFORM
exports.default = async function (configuration) {
  const signServer = '172.16.206.189:8080'
  const signTimestampSrv = 'DigiCert'

  signedPath = `${configuration.path}.signed`
  let sParams = `-s ${signServer} -i "${configuration.path}" -o "${signedPath}" --cert_hash ${configuration.options.certificateSha1} --ts ${signTimestampSrv}`
  let isDualSign = configuration.options.signingHashAlgorithms == null
  hashes = configuration.options.signingHashAlgorithms || []
  if (hashes.length > 1) {
    // 应用配置了多重签名
    sParams += ` --attach --hash ${configuration.hash}`
  }
  const platforms = process.platform; //mac打包windows 自动过滤掉签名
  console.log(' platforms is ',platforms)
  if (platforms == "darwin") {
    console.log('qa skip sign process !')
    return
  }

  // [双签优化]忽略第二次签名
  if (isDualSign && configuration.isNest) {
    return
  }

  if (isDualSign) {
    sParams += ' --dual'
  }

  console.log('sign params: ' + sParams)
  require('child_process').execSync(`ssigncode.exe sign ` + sParams, {
    stdio: 'inherit',
  })

  await require('fs-extra-p').rename(signedPath, configuration.path)
}
