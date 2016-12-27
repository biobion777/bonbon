'use strict'

const passport = require('passport')

const googleLogin = passport.authenticate('google', {scope: ['profile', 'email']})

const googleCallback = passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
})

module.exports = {
    googleLogin,
    googleCallback,
}
