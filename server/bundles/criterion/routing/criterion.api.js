'use strict'

const crud = require('../../api/controllers/crudController')('Criterion')
const controller = require('../controllers/criterionController')
const editableFields = require('../models/Criterion').editableFields

module.exports = {
    endpoint: '/criteria',
    params: {
        id: crud.paramConverter(),
    },
    actions: {
        Get: {
            path: '/:id',
            method: 'GET',
            middleware: [crud.checkOwnership(), crud.get()],
        },
        Create: {
            path: '/',
            method: 'POST',
            middleware: [crud.setOwnership(), crud.create(editableFields)],
        },
        GetAl: {
            path: '/',
            method: 'GET',
            middleware: [controller.getAll],
        },
        Update: {
            path: '/:id',
            method: 'PUT',
            middleware: [crud.checkOwnership(), crud.setOwnership(), crud.update(editableFields)],
        },
        Delete: {
            path: '/:id',
            method: 'DELETE',
            middleware: [crud.checkOwnership(), crud.remove()],
        },
    },
}
