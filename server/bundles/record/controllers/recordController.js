'use strict'

const moment = require('moment')
const mongoose = require('mongoose')
const Record = mongoose.model('Record')
const Criterion = mongoose.model('Criterion')
const apiError = require('../../api/services/apiError')

const prePaginate = (req, res, next) => {
    const page = req.query.p - 1 || 0
    const perPage = req.query.l || 50
    // first date ever (ie. today) may come from client for timezone difference purpose
    const referenceDate = req.query.startDate ? moment(req.query.startDate, 'YYYY-MM-DD') : moment()

    const startDate = referenceDate.subtract(page * perPage, 'days')
    const endDate = moment(startDate).subtract(perPage, 'days')

    const query = {
        date: {
            $lte: startDate.format('YYYY-MM-DD'),
            $gte: endDate.format('YYYY-MM-DD'),
        },
        user: req.user._id,
    }

    req.query.p = 1
    req.query.l = perPage
    req.paginateQuery = query
    req.paginateResponse = {
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD'),
    }

    next()
}

const preSave = (req, res, next) => {
    // adding user's criteria that are not sent by user in record "values" (with their default values)
    // removing sent record "values" that are not in user's criteria
    Criterion.find({
        user: req.user._id,
    }, function (err, criteria) {
        if (err) {
            return next(apiError.mongooseError(err))
        }

        const sentValues = req.body.values || []
        const sentCriteriaIds = sentValues.map(value => value.criterion)
        const userCriteriaIds = criteria.map(criterion => String(criterion._id))

        // removing nonexistent criteria
        const updatedValues = sentValues.filter(value => {
            return userCriteriaIds.includes(value.criterion)
        })

        // adding missing criteria
        criteria.forEach((criterion) => {
            if (!sentCriteriaIds.includes(String(criterion._id))) {
                updatedValues.push({
                    criterion: criterion._id,
                    value: criterion.default_value,
                })
            }
        })

        req.body.values = updatedValues

        next()
    })
}

module.exports = {
    prePaginate,
    preSave,
}
