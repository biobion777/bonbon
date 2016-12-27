const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

let entry = [
    'whatwg-fetch',
    './client/main.js',
]

let plugins = [
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(isProduction),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
]

let jsLoaderPresets = ['react', 'stage-0', 'es2015']

if (!isProduction) {
    // add hot module reload
    entry = entry.concat([
        'webpack-hot-middleware/client',
    ])

    plugins = plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
    ])

    jsLoaderPresets = jsLoaderPresets.concat([
        'react-hmre'
    ])
}

module.exports = {
    context: __dirname,
    devtool: isProduction ? 'source-map' : 'eval',
    entry,
    output: {
        path: path.join(__dirname, 'client', 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    plugins,
    module: {
        loaders: [
            // JS
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    plugins: [
                        'transform-decorators-legacy',
                        'transform-class-properties',
                    ],
                    presets: jsLoaderPresets,
                },
            },
            // styles
            {
                test: /\.less$/,
                loaders: [
                    'style',
                    'css',
                    'less',
                ]
            },
            {
                test: /\.css$/,
                loaders: [
                    'style',
                    'css',
                ]
            },
            // images
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file'
            },
            // json
            {
                test: /\.json$/,
                loader: 'json'
            },
        ],
    },
}
