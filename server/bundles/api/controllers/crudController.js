'use strict'

const moment = require('moment')
const mongoose = require('mongoose')
const _ = require('lodash')
const apiError = require('../services/apiError')
const filter = require('../services/filter')
const efp = require('../services/entityFieldsPicker')
const idUtils = require('../../../services/idUtils')

module.exports = (Model) => {
    if (_.isString(Model)) {
        Model = mongoose.model(Model)
    }

    const modelName = Model.modelName.toLowerCase()

    /**
     * Fetches entity in data base and stores it req.params.modelName
     * @param {String} [field='_id']
     * @param {String} [populate] mongoose style - fields to populate
     * @returns {Function}
     */
    const paramConverter = (field = '_id', populate) => {
        const query = {}

        return (req, res, next, id) => {
            query[field] = id

            const mongoQuery = Model.findOne(query)

            if (populate) {
                mongoQuery.populate(populate)
            }

            mongoQuery.exec((err, data) => {
                if (err) {
                    return next(apiError.mongooseError(err))
                }

                if (!data) {
                    return next(apiError.notFound(Model.modelName))
                }

                req.params[modelName] = data
                req.fetched_params = req.fetched_params || []
                req.fetched_params.push(modelName)
                next()
            })
        }
    }

    /**
     * Returns the entity in req.params.modelName as a json response
     * @param {string} [select=''] mongoose query projection (on top of param converter)
     */
    const get = (select) => {
        return (req, res, next) => {
            req.response = filter(
                efp.pickFields(req.params[modelName], req.user),
                select
            )

            next()
        }
    }

    /**
     * Create and saves an entity to the data base based on the req.body
     * @param {string} [select='-_id -__v'] mongoose query projection, used to limit the fields of query's body
     * @returns {Function}
     */
    const create = (select = '-_id -__v') => {
        return (req, res, next) => {
            // Remove empty strings
            const body = _.omit(filter(req.body, select), (value) => {
                return value === '' || value === null
            })

            const entity = new Model(body)

            // Check for dates
            Model.schema.eachPath((path, schemaType) => {
                if (schemaType.instance === 'Date' && body[path]) {
                    if (body[path].match(/^([0-2]?[0-9]|3[0-1])[\.\/ -](0?[1-9]|1[0-2])[\.\/ -](19[8-9][0-9]|20[0-1][0-9])$/)) {
                        entity[path] = moment(body[path], 'D/M/YYYY').tz('Europe/Paris').toDate()
                    }
                }
            })

            entity.save((err, data) => {
                if (err) {
                    return next(apiError.mongooseError(err))
                }

                req.createdEntity = data
                req.response = {
                    status: 201,
                    message: 'Successfully created.',
                    _id: data._id,
                    data,
                }
                next()
            })
        }
    }

    /**
     * Updates the entity in req.params.modelName based on the request body.
     * @param {string} [select='-_id -__v'] mongoose query projection, used to limit the fields of query's body
     */
    const update = (select = '-_id -__v') => {
        return (req, res, next) => {
            // Remove falsey values
            const body = _.chain(filter(req.body, select))
                .pickBy((value, key) => {
                    return value !== '' || req.params[modelName][key]
                })
                .mapValues((value) => {
                    return value === '' ? null : value
                })
                .value()

            const entity = _.mergeWith(
                req.params[modelName],
                _.omit(body, _.isNull),
                (a, b) => {
                    if (typeof b === 'object') {
                        return b
                    }
                }
            )

            const errors = {}
            const unset = {}
            Model.schema.eachPath((path, schemaType) => {
                // Check for dates
                if (schemaType.instance === 'Date' && body[path]) {
                    if (body[path].match(/^([0-2]?[0-9]|3[0-1])[\.\/ -](0?[1-9]|1[0-2])[\.\/ -](19[8-9][0-9]|20[0-1][0-9])$/)) {
                        entity[path] = moment(body[path], 'D/M/YYYY').tz('Europe/Paris').toDate()
                    }
                }

                // Check for unset (null values in body)
                if (body[path] === null) {
                    if (schemaType.options.required) {
                        errors[path] = 'This field is mandatory and can not be deleted.'
                    } else {
                        unset[path] = 1
                        delete entity[path]
                    }
                }
            })

            if (_.size(errors)) {
                return next(apiError.badRequest(errors))
            }

            Model.update(
                {
                    _id: entity._id,
                },
                {
                    $unset: unset,
                },
                (err) => {
                    if (err) {
                        return next(apiError.mongooseError(err))
                    }

                    entity.save((_err, data) => {
                        if (_err) {
                            return next(apiError.mongooseError(_err))
                        }

                        req.response = {
                            status: 200,
                            message: 'Successfully updated.',
                            data,
                        }
                        next()
                    })
                }
            )
        }
    }

    /**
     * Removes the entity in req.params.modelName from the data base.
     */
    const remove = () => {
        return (req, res, next) => {
            req.params[modelName].remove((err) => {
                if (err) {
                    return next(apiError.mongooseError(err))
                }

                req.response = {
                    status: 200,
                    message: 'Successfully deleted.',
                }
                next()
            })
        }
    }

    /**
     * Paginate the query in req.paginateQuery
     * @param {String} orderBy
     * @param {String} [populate] mongoose style - fields to populate (as a string with space separator)
     */
    const paginate = (orderBy, populate) => {
        orderBy = _.chain(orderBy.split(' '))
            .map((value) => {
                if (value[0] === '-') {
                    return [value.substr(1), -1]
                }

                return [value, 1]
            })
            .fromPairs()
            .value()

        return (req, res, next) => {
            let page = req.query.p - 1 || 0
            let perPage = req.query.l || 50

            page = Math.max(0, page)
            perPage = Math.max(Math.min(perPage, 70), 2)

            const paginateQuery = req.paginateQuery || {}

            const query = Model.find(paginateQuery)
                .sort(orderBy)
                .skip(page * perPage)
                .limit(perPage)

            if (populate) {
                query.populate(populate)
            }

            query.exec((err, entities) => {
                if (err) {
                    return next(apiError.mongooseError(err))
                }

                Model.find(paginateQuery).count((_err, total) => {
                    if (_err) {
                        return next(apiError.mongooseError(_err))
                    }

                    const totalPages = Math.ceil(total / perPage)
                    let route = req.protocol + '://' + req.hostname + req.originalUrl
                    route = route.replace(/\?.+$/, '')

                    req.response = _.merge(req.response, {
                        count: total,
                        page: page + 1,
                        per_page: perPage,
                        total_pages: totalPages,
                        prev: page > 0 ? route + '?p=' + page + '&l=' + perPage : null,
                        next: page < totalPages - 1 ? route + '?p=' + (page + 2) + '&l=' + perPage : null,
                        data: efp.pickFields(entities, req.user),
                    }, req.paginateResponse || {})

                    next()
                })
            })
        }
    }

    /**
     * Check if access is allowed to the currently targeted entity by the current user
     * @param property - key of entity where current user is checked
     * @returns {function(*, *, *)}
     */
    const checkOwnership = (property = 'user') => {
        return (req, res, next) => {
            const entity = req.params[modelName]

            if (!entity) {
                return next()
            }

            if (idUtils.eq(entity[property], req.user._id)) {
                return next()
            }

            return next(apiError.accessDenied())
        }
    }

    /**
     * Set current user in the body of request (used mainly for incoming forms data)
     * @param property - key of data body where current user is set
     * @returns {function(*, *, *)}
     */
    const setOwnership = (property = 'user') => {
        return (req, res, next) => {
            req.body[property] = req.user._id
            return next()
        }
    }

    return {
        paramConverter,
        get,
        create,
        update,
        remove,
        paginate,
        checkOwnership,
        setOwnership,
    }
}
