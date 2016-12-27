'use strict'

const crud = require('../../api/controllers/crudController')('User')
const controller = require('../controllers/userController')

module.exports = {
    endpoint: '/users',
    params: {
        id: crud.paramConverter(),
    },
    actions: {
        All: {
            path: '/',
            method: 'GET',
            role: 'ADMIN',
            middleware: crud.paginate('username'),
        },
        GetRoles: {
            path: '/roles',
            method: 'GET',
            middleware: controller.getRoles,
        },
        Search: {
            path: '/search',
            method: 'GET',
            role: 'ADMIN',
            middleware: controller.search,
        },
        Get: {
            path: '/:id',
            method: 'GET',
            role: 'ADMIN',
            middleware: crud.get(),
        },
    },
}
