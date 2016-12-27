'use strict'

const mongoose = require('mongoose')
const Criterion = mongoose.model('Criterion')
const apiError = require('../../api/services/apiError')

const getAll = (req, res, next) => {
    Criterion.find({
        user: req.user._id,
    }, (err, criteria) => {
        if (err) {
            return next(apiError.mongooseError(err))
        }

        req.response = criteria

        next()
    })
}

module.exports = {
    getAll,
}
