'use strict'

/**
 * Checks if value is a valid email address.
 * @type {{validator: Function, msg: string}}
 */
module.exports.email = {
    validator: (val) => {
        return val.match(/^([a-z0-9_-]+\.?)+@([a-z0-9](-?[a-z0-9]+)+-?\.)+[a-z]{2,4}$/)
    },
    msg: 'This email address is not valid.',
}

/**
 * Checks if string length is at least equal to length
 * @param length
 * @returns {{validator: Function, msg: string}}
 */
module.exports.minLength = (length) => {
    return {
        validator: (val) => {
            return val.length >= length
        },
        msg: 'This value should be at least ' + length + ' characters long.',
    }
}

/**
 * Checks if string length is at least equal to length
 * @param [limit=0]
 * @returns {{validator: Function, msg: string}}
 */
module.exports.greaterOrEqual = (limit) => {
    limit = limit || 0

    return {
        validator: (val) => {
            return val >= limit
        },
        msg: 'This value should be greater of equal to ' + limit + '.',
    }
}

module.exports.gender = {
    validator: (val) => {
        return !val || val === 'male' || val === 'female'
    },
    msg: 'This value is not valid.',
}
