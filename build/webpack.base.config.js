
const path = require('path') // node path模块
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue文件处理插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css提取插件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 静态资源复制插件
const HtmlWebpackPlugin = require('html-webpack-plugin') // html文件生成插件
// const glob = require('glob') // 多入口处理模块
const utils = require('./util') // node path模块
const config = require('../config') // node path模块

// 获取文件路径
const resolve = dir => path.join(__dirname, '..', dir)

// 指定静态资源生成的路径
const assetPath = dir => path.posix.join('static', dir)

// 多入口
// const getEntry = (rootSrc, pattern) => {
//     var files = glob.sync(path.resolve(rootSrc, pattern))
//     return files.reduce((res, file) => {
//         var info = path.parse(file)
//         var key = info.dir.slice(rootSrc.length + 1) + '/' + info.name
//         res[key] = path.resolve(file)
//         return res
//     }, {})
// }
// const appEntry = { app: resolve('./src/index.js') }
// const pagesEntry = getEntry(resolve('./src'), 'pages/**/index.js')
// const entry = Object.assign({}, appEntry, pagesEntry)

// eslint
const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: config.dev.showEslintErrorsInOverlay
    }
})

// webpack基础配置
const webpackConfig = {
    // 入口
    entry: {
        app: './src/index.js'
    },
    // 输出
    output: {
        path: resolve('dist'),
        filename: assetPath('/js/[name].[chunkhash].js'),
        chunkFilename: assetPath('/js/[name].[chunkhash].js'),
        publicPath: '/'
    },
    // 文件后缀忽略扩展|别名
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    // 模块
    module: {
        rules: [
            // eslint
            ...[createLintingRule()],
            // ...(config.dev.useEslint ? [createLintingRule()] : []),
            // 预编译样式处理
            ...utils.styleLoaders({ sourceMap: true, usePostCSS: true }),
            // vue文件处理
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        cssSourceMap: true,
                        cacheBusting: true,
                        transformToRequire: {
                            video: ['src', 'poster'],
                            source: 'src',
                            img: 'src',
                            image: 'xlink:href'
                        }
                    }
                }],
                include: [resolve('src')]
            },

            // js babel编译处理
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: [resolve('src'), resolve('test')]
            },

            // 图片处理
            {
                test: /\.(png|jpe?g|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8 * 1024,
                            name: assetPath('image/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },

            // 字体处理
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8 * 1024,
                        name: assetPath('fonts/[name].[hash:7].[ext]')

                    }
                }]

            },

            // 音频处理
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8 * 1024,
                            name: assetPath('media/[name].[hash:7].[ext]')
                        }

                    }
                ]
            }
        ]
    },

    // 插件
    plugins: [
        // vue插件
        new VueLoaderPlugin(),

        // 压缩提取css
        ...(process.env.NODE_ENV === 'production'
            ? [
                new MiniCssExtractPlugin({
                    filename: process.env.NODE_ENV === 'production' ? assetPath('/css/[name].[hash].css') : assetPath('/css/[name].css'),
                    // chunkFilename: process.env.NODE_ENV === 'production' ? assetPath('/css/[name].[hash].css') : assetPath('/css/[name].css'),
                })
            ]
            : []),
        // 静态页面html生成
        new HtmlWebpackPlugin({
            title: 'webpack!',
            filename: 'index.html',
            template: 'index.html',
            // 压缩配置项
            minify: {
                removeComments: true, // 移除注释
                collapseWhitespace: true, // 去除多余无用空格
                removeAttributeQuotes: true, // 移除多余的引号
            },
            // 控制打包好的文件依赖的排序 'none' | 'auto' | 'dependency' | 'manual' | {Function}
            chunksSortMode: 'dependency', // 按依赖排序
        }),

        // 静态资源提取
        new CopyWebpackPlugin([{ from: 'static/**/*' }]),
    ],

    // node相关配置项
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}

module.exports = webpackConfig