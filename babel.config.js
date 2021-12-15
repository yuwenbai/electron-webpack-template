console.log(' babel.config.js')
const developmentEnvironments = ['development', 'test']

// const developmentPlugins = ['@babel/plugin-transform-runtime',{
//   "absoluteRuntime": false,
//   "corejs": false,
//   "helpers": false,
//   "regenerator": true,
//   "useESModules": false
// }]

const productionPlugins = [

  // babel-preset-react-optimize
  // require('@babel/plugin-transform-react-constant-elements'),
  // require('@babel/plugin-transform-react-inline-elements'),
]

module.exports = (api) => {
  // See docs about api at https://babeljs.io/docs/en/config-files#apicache

  const development = api.env(developmentEnvironments)

  return {
    presets: [
      require('@babel/preset-env',{ "targets": {
        "node": "10"
      }}),
      [require('@babel/preset-react'), { development }],
    ],
    plugins: [
      // [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      // [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      // developmentPlugins
    ],
  }
}
