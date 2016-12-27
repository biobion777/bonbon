'use strict'

const path = require('path')

const renderClient = (req, res, next) => {
    if (!req.isAjaxRequest) {
        return res.render(path.join(__dirname, '../../client/index.html'))
    }

    next()
}

module.exports = renderClient
