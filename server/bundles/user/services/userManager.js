'use strict'

const mongoose = require('mongoose')
const apiError = require('../../api/services/apiError')
const _ = require('lodash')

const User = mongoose.model('User')

const search = (queryString, limit, populate, callback) => {
    limit = limit ? Math.max(1, Math.min(70, limit)) : 10

    let query

    // looking for an email
    if (queryString.includes('@')) {
        const email = _.deburr(queryString).toLowerCase().split('@')
        query = {
            email: new RegExp(_.escapeRegExp(email[0]) + '.*@.*' + _.escapeRegExp(email[1])),
        }
    } else {
        // standard query
        const keywords = _.words(queryString)
        queryString = _.escapeRegExp(_.deburr(queryString).toLowerCase())

        query = {
            $or: [
                {$and: []},
                {email: new RegExp(queryString + '.*@')},
            ],
        }

        keywords.forEach((word) => {
            word = _.escapeRegExp(_.deburr(word).toLowerCase())
            query.$or[0].$and.push({username_canonical: new RegExp(word)})
        })
    }

    User.find(query)
        .limit(limit)
        .populate(populate ? '' : '')
        .exec((err, users) => {
            if (err) {
                return callback(apiError.mongooseError(err))
            }

            callback(null, users)
        })
}

module.exports = {
    search,
}
