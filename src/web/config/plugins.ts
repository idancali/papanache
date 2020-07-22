import path from 'path'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack, { Plugin } from 'webpack'
import { PackingOptions, StaticPlugin } from '..'

export function all (options: PackingOptions): Plugin[] {

  console.log("PAPAPAPA", options)
    const assetsDir = path.resolve(options.contextDir, 'carmel', 'assets')
    const targetAssetsDir = path.resolve(options.destDir, 'assets')
    const copyAssets = [{
      from: assetsDir, to: targetAssetsDir, type: "dir", force: true
    }]

    let all = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
            'process.env.carmel': JSON.stringify(options)
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CopyPlugin(copyAssets),
    ]  
    
    options.chunks.map((chunkId: string) => {
      const chunk = require(`${options.mainDir}/carmel/chunks/${chunkId}/chunk.json`)
      const chunkRoot = chunk.path.substring(1)

      all.push(new HtmlWebpackPlugin({
        filename: `${chunkRoot}${chunkRoot.length === 0 ? '' : '/'}index.html`,
        template: path.resolve(options.templateFile),
        compile: false,
        chunk,
        chunks: ['__main', chunk.name],
        inject: true,
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: true
        }
      }))
    })   

    if (options.isStatic) {
      all.push(new StaticPlugin(options))
      all.push(new MiniCssExtractPlugin({
        filename: 'app.css'
      }))
    } else {
      all.push(new webpack.HotModuleReplacementPlugin())
    }

    return all
}