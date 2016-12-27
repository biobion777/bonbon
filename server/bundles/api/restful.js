'use strict'

const express = require('express')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const filterAnon = require('../auth/middlewares/filterAnonymous')
const isGranted = require('../auth/middlewares/isGranted')
const requiredParams = require('./middlewares/requiredParams')
const sendResponse = require('./middlewares/sendResponse')

const restful = express()
module.exports = restful

const init = () => {
    const entities = getEntities()

    const registerGlobalMiddlewares = (entity, router) => {
        // Register params converters
        const params = entity.params || {}
        _.forEach(params, (paramConverter, paramName) => {
            router.param(paramName, paramConverter)
        })
    }

    const registerActions = (entity, router) => {
        const actions = entity.actions || {}
        _.forEach(actions, (config) => {
            console.log('Registering route', config.method, entity.endpoint + config.path)
            const middlewares = []

            if (config.allow_anonymous !== true) {
                middlewares.push(filterAnon)
            }

            if (config.role) {
                middlewares.push(isGranted(config.role))
            }

            if (config.required_params) {
                middlewares.push(requiredParams(config.required_params))
            }

            router[config.method.toLowerCase()](
                config.path,
                _.flattenDeep([middlewares, config.middleware, sendResponse])
            )
        })
    }

    entities.forEach((entity) => {
        // Create a router for each entity
        const router = express.Router()

        // Register middlewares
        registerGlobalMiddlewares(entity, router)
        registerActions(entity, router)

        // Plug router into app
        restful.use(entity.endpoint, router)
    })
}

/**
 * Searches every route configs in /bundles/{bundleName}/routing/{route}.api.js
 * @returns {Array} found route configs
 */
const getEntities = () => {
    const entities = []
    const bundleDir = path.join(__dirname, '..')

    fs.readdirSync(bundleDir)
        .map((file) => {
            return path.join(bundleDir, file)
        })
        .filter((file) => {
            return fs.statSync(file).isDirectory()
        })
        .forEach((bundle) => {
            const routingDir = path.join(bundle, 'routing')

            try {
                fs.readdirSync(routingDir).forEach((file) => {
                    if (file.includes('.api.js')) {
                        entities.push(require(path.join(routingDir, file)))
                    }
                })
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.log('Error while getting entities', err.stack)
                }
            }
        })

    return entities
}

init()
