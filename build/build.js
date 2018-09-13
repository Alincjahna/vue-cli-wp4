const ora = require('ora') // 显示loading加载
const chalk = require('chalk') // 文字属性控制模块
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.config')
// import ora from 'ora'
const spinner = ora('building for production...')
spinner.start()

// rm(path.resolve(__dirname, '..', 'dist'), () => {
webpack(webpackConfig, (err, stats) => { // stats 编译过程信息的统计对象
    spinner.stop()
    if (err) throw err
    // stats的参数配置项
    const statsConfig = {
        colors: true, //  true 在控制台显示颜色
        modules: false, // true 添加构建模块信息
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false, // true 添加chunk 信息（设置为 `false` 能允许较少的冗长输出）
        chunkModules: false, // true 构建模块信息添加到 chunk 信息
    }
    // 向终端(控制台)输出统计信息
    process.stdout.write(stats.toString(statsConfig) + '\n\n')

    // 编译错误
    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
})

// })