'use strict'

const apiError = require('../../api/services/apiError')
const isGranted = require('../services/isGranted')

const isGrantedMiddleware = (role) => {
    return (req, res, next) => {
        if (!isGranted(role, req.user)) {
            return next(apiError.accessDenied())
        }

        next()
    }
}

module.exports = isGrantedMiddleware
