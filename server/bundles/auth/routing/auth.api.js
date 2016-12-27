'use strict'

const controller = require('../controllers/authController')

module.exports = {
    endpoint: '/auth',
    params: {},
    actions: {
        GoogleLogin: {
            path: '/google',
            method: 'GET',
            middleware: controller.googleLogin,
            allow_anonymous: true,
        },
        GoogleCallback: {
            path: '/google/callback',
            method: 'GET',
            middleware: controller.googleCallback,
            allow_anonymous: true,
        },
    },
}
