'use strict'

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
const parameters = require('./parameters_' + env)

module.exports = {
    mongodb: {
        host: parameters.mongodb_host,
        database: parameters.mongodb_name,
    },
    smtp: {
        port: parameters.smtp_port,
    },
    path: {
        protocol: parameters.path_protocol,
        domain: parameters.path_domain,
    },
    roles: require('./roles'),
    secret: parameters.secret,
    port: parameters.port,
    auth: parameters.auth,
}
