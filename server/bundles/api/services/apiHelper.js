'use strict'

const apiError = require('./apiError')
const _ = require('lodash')

/**
 * Checks if req.body has the required params and returns an error if it does not.
 * Returns null otherwise.
 * @param {object} req
 * @param {Array} params Array of required params
 * @returns {object|null}
 */
const requiredParams = (req, params) => {
    if (!_.isArray(params)) {
        params = [params]
    }

    try {
        params.forEach((param) => {
            if (_.isUndefined(req.body[param])) {
                throw new Error(param)
            }
        })
    } catch (err) {
        return apiError.missingParameter(err.message)
    }

    return null
}

module.exports = {
    requiredParams,
}
