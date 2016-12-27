'use strict'

const swig = require('swig')

module.exports = init

function init(app, viewsDirectory) {
    viewsDirectory = viewsDirectory || './'

    app.engine('html', swig.renderFile)
    app.set('view engine', 'html')
    app.set('views', viewsDirectory)
    app.set('view cache', false)
    swig.setDefaults({cache: false})
}
