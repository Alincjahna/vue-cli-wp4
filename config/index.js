'use strict'

const path = require('path')

module.exports = {
    dev: {
        // path
        assetRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetPublicPath: '/',

        // webpack-dev-server
        host: 'localhost',
        port: 10086,
        openBrower: true,
        compress: true,
        proxy: {}, // 代理
        openOverlay: true,
        quiet: true, // 控制台是否禁止打印警告和错误 若使用 FriendlyErrorsPlugin 此处为 true

        // source-map
        devtool: 'inline-source-map',
        isHistory: true,

        
        // css source-map
        cssSourceMap: true,
        
        // 启用FriendlyErrorsPlugin插件的错误提醒
        notifyOnErrors: true,

        // esling-loader
        useESlint: true,
        showEslintErrorsInOverlay: true, // 是否全屏覆盖显示eslint错误
    },
    prod: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // path
        assetRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetPublicPath: '/',

        // source-map
        devtool: '#source-map',
        productionSourceMap: true,
        
        // Gzip
        produtionGzip: false,
        produtionGzipExtensions: ['js', 'css']

    }
}