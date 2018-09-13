// 环境参数变量
const { NODE_ENV } = require('../config/prod.env.js')
const merge = require('webpack-merge')
// import merge from 'webpack-merge'
const baseWebpackConfig = require('./webpack.base.config')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 调用config目录的配置信息
// let { dev: { } } = require('../config')

const webpackConfig = merge(baseWebpackConfig, {
    mode: NODE_ENV, // 模式
    // 压缩配置项
    optimization: {
        minimize: true,
        minimizer: [
            // js压缩处理插件
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            // css提取压缩处理插件
            new OptimizeCSSPlugin({
                // 匹配需要处理的css文件
                assetNameRegExp: /\.css\.*(?!.*map)/g, //  /\.optimize\.css$/g, /\.css\.*(?!.*map)/g
                // css提取压缩的模块
                cssProcessor: require('cssnano'),
                // css提取压缩的配置项
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: false } }],
                },
                canPrint: true
            })
        ],
        splitChunks: {
            // chunks: 'async',
            // minChunks: 1,
            cacheGroups: {
                js: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: "initial",
                    // minChunks: 1
                },
                css: {
                    test: /\.(css|less|scss|styl(us)?)$/,
                    name: 'vendors',
                    chunks: 'all',
                    minChunks: 2
                },
            }
        }
    },
    // source-map模式
    devtool: 'source-map',
})

module.exports = webpackConfig
