'use strict'

const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)

const config = require('../config/config')

const init = (app) => {
    app.use(session({
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
        // persist sessions in database until they expire
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
        }),
    }))
    app.use(passport.initialize())
    app.use(passport.session())
}

module.exports = init
