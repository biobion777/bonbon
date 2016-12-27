'use strict'

const _ = require('lodash')

/**
 * Filters an object fields. Either by picking a restricted list of space separated fields
 * or by omitting then if they start with a dash.
 * @param {object} object object to filter
 * @param {string} select mongoose style projection query
 * @returns {object}
 */
const filter = (object, select) => {
    if (!select) {
        return object
    }

    let fields = select.split(' ')

    // We want to omit fields
    if (fields[0][0] === '-') {
        if (!fields.every(field => field.startsWith('-'))) {
            throw new Error('You can not mix exclusion and inclusion')
        }

        fields = fields.map((field) => {
            return field.substr(1)
        })

        return _.omit(object, fields)
    }

    // Otherwise we want to pick fields
    if (fields.some(field => field.startsWith('-'))) {
        throw new Error('You can not mix exclusion and inclusion')
    }

    return _.pick(object, fields)
}

module.exports = filter
