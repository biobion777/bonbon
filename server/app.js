'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const init = require('./init/env')

const isProduction = process.env.NODE_ENV === 'production'

// override Mongoose promises library
mongoose.Promise = global.Promise
mongoose.plugin(beautifyUnique)

const app = express()

if (isProduction) {
    app.use(express.static("./client/dist"))
} else {
    const webpackConfig = require('../webpack.config')
    const compiler = webpack(webpackConfig)
    // configure Webpack
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        quiet: true,
        publicPath: webpackConfig.output.publicPath,
    }))
    app.use(webpackHotMiddleware(compiler))
}

// basics Node config
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

init(app)

module.exports = app
