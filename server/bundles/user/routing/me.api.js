'use strict'

const crud = require('../../api/controllers/crudController')('User')
const controller = require('../controllers/userController')

module.exports = {
    endpoint: '/users/me',
    params: {},
    actions: {
        Get: {
            path: '/',
            method: 'GET',
            middleware: controller.getCurrentUser,
        },
        Update: {
            path: '/',
            method: 'PUT',
            middleware: crud.update('gender'),
        },
    },
}
