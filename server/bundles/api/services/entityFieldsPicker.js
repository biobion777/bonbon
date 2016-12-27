'use strict'

const mongoose = require('mongoose')
const isGranted = require('../../auth/services/isGranted')
const _ = require('lodash')

const Schema = mongoose.Schema

/**
 * Return the entity or the array of entities with each entity having only the readable fields for the given user
 * @param {Entity | Object | Entity[] | Object[]} entities
 * @param {User} user
 * @param {Model | Schema | String} [model] if model can't be guessed from entities it should be passed here
 * @returns {Object | Object[]}
 */
const pickFields = (entities, user, model) => {
    if (!entities) {
        return
    }

    const singleEntity = !_.isArray(entities)

    if (singleEntity) {
        entities = [entities]
    }

    if (!entities.length) {
        return singleEntity ? undefined : []
    }

    let Model = _.get(entities[0], 'constructor')

    // if Model is not a model, get model
    if (_.get(Model, 'name') !== 'model') {
        if (_.isString(model)) {
            Model = mongoose.model(model)
        } else {
            Model = model
        }
    }

    const schema = model instanceof Schema ? model : Model.schema

    entities = entities.map((entity) => {
        if (entity.toObject !== undefined) {
            entity = entity.toObject()
        }

        entity = _.pick(entity, getReadableFields(schema, entity, user))
        pickFieldsDeep(schema, entity, user)

        return entity
    })

    return singleEntity ? entities[0] : entities
}

/**
 * Returns an array of readable fields for the given user
 * @param {Schema} schema
 * @param {Object} entity
 * @param {User} user
 * @returns {String[]}
 */
const getReadableFields = (schema, entity, user) => {
    const readableFields = []

    _.forEach(schema.tree, (options, field) => {
        // Always keep _id
        if (field === '_id') {
            return readableFields.push(field)
        }

        let readable = options.readable

        // Place single conditions in an array
        if (!_.isArray(readable)) {
            readable = [readable]
        }

        // At least one of the condition must be fulfilled
        const pick = readable.some((condition) => {
            if (_.isBoolean(condition)) {
                return condition
            }

            if (_.isString(condition)) {
                return isGranted(condition, user)
            }

            if (_.isFunction(condition)) {
                return condition(entity, user)
            }

            return false
        })

        if (pick) {
            readableFields.push(field)
        }
    })

    return readableFields
}

/**
 * Recursively picks fields on each populated field.
 * @param {Schema} schema
 * @param {Object} entity
 * @param {User} user
 */
const pickFieldsDeep = (schema, entity, user) => {
    // Go through each field of the entity
    _.forEach(entity, (value, field) => {
        const isArray = _.isArray(_.get(schema.paths[field], 'options.type'))
        const ref = isArray ?
            _.get(schema.paths[field], 'options.type[0].ref') :
            _.get(schema.paths[field], 'options.ref')
        const isPopulated = _.isPlainObject(value)

        if (isPopulated && ref) {
            entity[field] = pickFields(value, user, ref)
        }

        if (schema.paths[field].schema) {
            entity[field] = pickFields(value, user, schema.paths[field].schema)
        }
    })
}

module.exports = {
    pickFields,
}
