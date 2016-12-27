'use strict'

const requestDecorator = (req, res, next) => {
    req.isAjaxRequest = req.headers.accept === 'application/json'

    next()
}

module.exports = requestDecorator
