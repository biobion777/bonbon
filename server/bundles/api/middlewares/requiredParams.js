'use strict'

const apiHelper = require('../services/apiHelper')

/**
 * Checks that all params are available in req.body, returns an error to the client otherwise.
 * @param {Array} params
 * @returns {Function} middleware
 */
const requiredParams = (params) => {
    return (req, res, next) => {
        const err = apiHelper.requiredParams(req, params)

        if (err) {
            return next(err)
        }

        next()
    }
}

module.exports = requiredParams
