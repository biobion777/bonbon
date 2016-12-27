'use strict'

const apiError = require('../../api/services/apiError')

const filterAnonymous = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(apiError.unauthorized())
    }

    next()
}

module.exports = filterAnonymous
