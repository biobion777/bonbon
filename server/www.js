'use strict'

const http = require('http')
const app = require('./app')
const config = require('./config/config')

const onListening = () => {
    const port = server.address().port

    console.log('Listening on http://localhost:%s', port)
}

const onError = (error) => {
    const port = server.address().port

    if (error.syscall !== 'listen') {
        throw error
    }

    switch (error.code) {
        case 'EACCES':
            console.error('Port ' + port + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error('Port ' + port + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

const server = http.createServer(app)
    .listen(config.port)
    .on('error', onError)
    .on('listening', onListening)
