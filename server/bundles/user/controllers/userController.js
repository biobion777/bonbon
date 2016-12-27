'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const apiError = require('../../api/services/apiError')
const roles = require('../../../config/roles')
const userManager = require('../services/userManager')
const efp = require('../../api/services/entityFieldsPicker')

const search = (req, res, next) => {
    if (!req.query.q) {
        return next(apiError.missingParameter('q'))
    }

    userManager.search(req.query.q, req.query.l, true, (err, users) => {
        if (err) {
            return next(err)
        }

        res.json(efp.pickFields(users, req.user))
    })
}

const getRoles = (req, res) => {
    res.json(roles)
}

const getCurrentUser = (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            return next(apiError.mongooseError(err))
        }

        req.response = user

        next()
    })
}

module.exports = {
    search,
    getRoles,
    getCurrentUser,
}
