'use strict'

const parameters = require('../config/config.js')
const passport = require('passport')

const init = (app) => {
    require('./db')(parameters.mongodb)
    require('./sessions')(app)
    require('../config/passport')(passport)
    require('./swig')(app)
    require('./routing')(app)
}

module.exports = init
