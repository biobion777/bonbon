'use strict'

const express = require('express')
const path = require('path')
const api = require('../bundles/api/restful')
const renderClient = require('./renderClient')
const requestDecorator = require('./requestDecorator')

const init = (app) => {
    app.use(requestDecorator)
    app.use('/api', api)
    app.use(express.static(path.join(__dirname, '../../client/dist')))
    app.use(renderClient)
    app.use(notFound)
    app.use(logErrors)
    app.use(errorHandler)
}

const notFound = (req, res, next) => {
    const err = {
        status: 404,
    }

    next(err)
}

// keep the 4 arguments to mark this function as an error middleware for Express
const logErrors = (err, req, res, next) => {
    if (err.stack) {
        if (err.code === 'ECONNREFUSED') {
            console.log('>>>>> Could not connect to SMTP server, did you forget to run maildev?')
        } else {
            console.log(err)
            console.error(err.stack)
        }
    }

    next(err)
}

// keep the 4 arguments to mark this function as an error middleware for Express
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    err.status = err.status || 500
    res.status(err.status)

    if (req.isAjaxRequest) {
        if (err.error === undefined) {
            switch (err.status) {
                case 400:
                    err.error = 'bad_request'
                    break
                case 401:
                    err.error = 'unauthorized'
                    break
                case 404:
                    err.error = 'not_found'
                    err.message = err.message || 'This page does not exist.'
                    break
                case 500:
                    err.error = 'internal_error'
                    err.message = err.message || 'An internal error occurred.'
                    break
                default:
            }
        }

        res.json(err)
    } else {
        res.render(path.join(__dirname, '../views/error.html'), {error: err})
    }
}

module.exports = init
