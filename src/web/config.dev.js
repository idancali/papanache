const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const pages = require('./pages')
const rules = require('./rules')
const WebPlugin = require('./webPlugin')

module.exports = (options) => {
  const root = (options.root || options.dir)
  const dir = options.dir
  const templateDir = options.templateDir || options.dir

  const targetDir = path.resolve(dir, `.${options.name}`, 'web')
  const targetAssetsDir = `${path.resolve(targetDir, 'assets')}/`

  const templateAssets = options.templateAssets || []
  const assetScripts = templateAssets.map(asset => ({ context: path.resolve(templateDir, asset.path), from: asset.glob }))
                       .concat([{ context: path.resolve(dir, 'assets'), from: '**/*' }])
  
  return {
    context: path.resolve(root),
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client',
      'webpack/hot/only-dev-server',
      options.script
    ],
    mode: 'development',    
    watch: true,
    output: {
      filename: `${options.name}.js`,
      path: path.resolve(dir, `.${options.name}`, 'web'),
      publicPath: '/',
      libraryTarget: 'umd'
    },
    devtool: 'inline-source-map',
    target: 'web',
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        moment: 'moment/moment.js',
        'react-dom': require.resolve('@hot-loader/react-dom')
      },
      modules: [
        path.resolve(dir),
        path.resolve(dir, "node_modules"),
        path.resolve(templateDir),
        path.resolve(templateDir, "node_modules"),
        path.resolve(root),
        path.resolve(root, "node_modules"),
        'node_modules'
      ]
    },

    module: {
      noParse: [/moment.js/],
      rules: rules(options, true)
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CopyWebpackPlugin(assetScripts.map(asset => Object.assign({}, asset, { to: targetAssetsDir, toType: 'dir', force: true })))
    ]    

    .concat(pages(options, true))
    .concat([new WebPlugin(Object.assign({}, options, { dev: true }))]),

    optimization: {
      nodeEnv: 'development'
    },

    devServer: {
      host: '0.0.0.0',
      compress: false,
      inline: true,
      clientLogLevel: 'silent',
      stats: 'none',
      liveReload: true,
      noInfo: true,
      port: options.port,
      contentBase: path.resolve(dir, `.${options.name}`, 'web'),
      watchContentBase: true,
      historyApiFallback: true,
      hot: true
    }
  }
}
