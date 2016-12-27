'use strict'

const _ = require('lodash')

const eq = (e1, e2) => {
    return getId(e1) == getId(e2) // eslint-disable-line
}

const getId = (entity) => {
    if (_.isNumber(entity)) {
        return entity
    }
    if (_.isString(entity)) {
        return parseInt(entity, 10)
    }

    return _.get(entity, '_id')
}

module.exports = {
    eq,
    getId,
}
