'use strict'

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const initConnection = (parameters) => {
    const connect = () => {
        const options = {
            server: {
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 5000,
                },
            },
        }
        mongoose.connect('mongodb://' + parameters.host + '/' + parameters.database, options)
    }

    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error', err)
        process.exit(1)
    })

    mongoose.connection.on('disconnected', connect)

    connect()
}

/**
 * Registers every models in /bundles/{bundleName}/model
 */
const initModels = () => {
    const bundleDir = path.join(__dirname, '../bundles')

    fs.readdirSync(bundleDir)
        .map((file) => {
            return path.join(bundleDir, file)
        })
        .filter((file) => {
            return fs.statSync(file).isDirectory()
        })
        .forEach((bundle) => {
            const modelDir = path.join(bundle, 'models')

            try {
                fs.readdirSync(modelDir)
                    .forEach((file) => {
                        if (file.includes('.js')) {
                            require(path.join(modelDir, file))
                        }
                    })
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.log('Error while getting models', err.stack)
                }
            }
        })
}

const init = (parameters) => {
    initConnection(parameters)
    initModels()
}

module.exports = init
