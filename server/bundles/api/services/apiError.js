'use strict'

const _ = require('lodash')

const notFound = (what) => {
    return {
        status: 404,
        message: (what || 'This page') + ' does not exist.',
    }
}

const missingParameter = (parameter) => {
    return {
        status: 400,
        error: 'missing_parameter',
        message: 'The following parameter is missing: ' + parameter,
    }
}

const formError = (err, sub) => {
    const errors = {}

    _.forOwn(err.errors, (value, key) => {
        if (sub) {
            key = _.last(key.split('.'))
        }
        errors[key] = value.message
    })

    return {
        status: 400,
        message: 'The form is not valid.',
        errors,
    }
}

const badRequest = (errors) => {
    return {
        status: 400,
        message: 'Bad request.',
        errors,
    }
}

const mongooseError = (err, sub) => {
    sub = sub || false

    if (err.name === 'ValidationError') {
        return formError(err, sub)
    }

    return {
        error: 'mongoose_error',
        message: err.message,
    }
}

const accessDenied = (message) => {
    return {
        status: 403,
        error: 'access_denied',
        message: message || 'You do not have access to this page.',
    }
}

const unauthorized = () => {
    return {
        status: 401,
        error: 'unauthorized',
        message: 'You need to be logged in to access this page.',
    }
}

const badCredentials = () => {
    return {
        status: 401,
        error: 'bad_credentials',
        message: 'Wrong address or password.',
    }
}

module.exports = {
    mongooseError,
    notFound,
    missingParameter,
    badRequest,
    accessDenied,
    unauthorized,
    badCredentials,
}
