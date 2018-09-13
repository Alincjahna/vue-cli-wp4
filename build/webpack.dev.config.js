// 环境参数变量
const { NODE_ENV } = require('../config/dev.env.js')
const path = require('path')
const config = require('../config')
const merge = require('webpack-merge') // webpack的合并方法模块
const portfinder = require('portfinder') // 自动检索下一个可用端口
const packageConfig = require('../package.json')
const baseWebpackConfig = require('./webpack.base.config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 调用config目录的配置信息
let { dev: { host, port, openBrower, openOverlay, proxy = {}, quiet = true, isHistory, assetPublicPath } } = require('../config')

// 主机名
host = process.env.HOST || host
// 端口号
port = process.env.PORT && Number(process.env.PORT) || port

const webpackConfig = merge(baseWebpackConfig, {
    mode: NODE_ENV, // 模式
    // 热加载
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        // 启动Gzip
        compress: true,
        // 主机名
        host,
        // 端口号
        port,
        // 是否自动打开浏览器
        open: openBrower,
        // console 控制台显示的消息，可能的值有 none, error, warning 或者 info
        clientLogLevel: 'warning',
        // History API,当遇到 404 响应时会被替代为 index.html
        ...(isHistory ? {
            historyApiFallback: {
                rewrites: [
                    { from: /.*/, to: path.posix.join('/', 'index.html') },
                ],
            }
        } : {}),
        // 是否开启错误全屏覆盖 false Object
        overlay: openOverlay ? { warnings: false, errors: true } : false,
        // 公共路径
        publicPath: assetPublicPath,
        proxy,
        quiet, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: true, // 文件系统检测改动
        }
    },
    // source-map模式
    devtool: 'inline-source-map',
})

// 插件FriendlyErrorsPlugin的onEorror回调
const createNotifierCallback = () => {
    const notifier = require('node-notifier')

    return (severity, errors) => {
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        })
    }
}

// 用portfinder模块自动检测并启用下一个可用端口
module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = port
    portfinder.getPortPromise().then(port => {
        process.env.PORT = port // 设置process 端口
        // add port to devServer config
        webpackConfig.devServer.port = port // 设置 devServer 端口

        // Add FriendlyErrorsPlugin 错误提示插件
        webpackConfig.plugins.push(new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${webpackConfig.devServer.host}:${port}`],
            },
            onErrors: config.dev.notifyOnErrors ? createNotifierCallback() : undefined
        }))
        resolve(webpackConfig)
    }).catch(err => {
        console.log('err', err)
        reject(err)
    })
})