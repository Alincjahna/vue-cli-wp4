'use strict'
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css提取插件

// 遍历处理css loader
exports.cssLoaders = (options = {}) => {
    const { usePostCSS, sourceMap } = options // usePostCSS 是否弃用postcss sourceMap 是否弃用sourcemap
    // 默认loader css-loader
    const cssLoader = {
        loader: 'css-loader',
        options: { sourceMap }
    }
    // 默认loader postcss-loader
    const postcssLoader = {
        loader: 'postcss-loader',
        options: { sourceMap }
    }

    // loader map
    const loaderMap = {
        css: null,
        postcss: null,
        less: null,
        sass: { indentedSyntax: true },
        scss: null,
        stylus: null,
        styl: null
    }

    // loader map 处理器
    // @return Object
    const generateLoaders = map => {
        const loaders = [
            process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            cssLoader,
        ]
        // usePostCSS true 使用postcss模块
        usePostCSS && loaders.push(postcssLoader)
        // 遍历处理loaderMap
        for (const [key, val] of Object.entries(map)) {
            loaderMap[key] = [...loaders, {
                loader: key + '-loader',
                options: val ? Object.assign({}, val, { sourceMap }) : Object.assign({}, { sourceMap })
            }]
        }
        return loaderMap
    }
    return generateLoaders(loaderMap)
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = options => {
    const output = []
    const loaders = exports.cssLoaders(options)
    for (const [key, val] of Object.entries(loaders)) {
        output.push({
            test: new RegExp(`.${key}$`), // '\\.' + key + '$'
            use: val
        })
    }
    return output
}
