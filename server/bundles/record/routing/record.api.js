'use strict'

const crud = require('../../api/controllers/crudController')('Record')
const controller = require('../controllers/recordController')
const editableFields = require('../models/Record').editableFields

module.exports = {
    endpoint: '/records',
    params: {
        id: crud.paramConverter(),
        date: crud.paramConverter('date'),
    },
    actions: {
        Paginate: {
            path: '/mine',
            method: 'GET',
            middleware: [controller.prePaginate, crud.paginate('-date')],
        },
        GetByDate: {
            path: '/at/:date',
            method: 'GET',
            middleware: [crud.checkOwnership(), crud.get()],
        },
        Get: {
            path: '/:id',
            method: 'GET',
            middleware: [crud.checkOwnership(), crud.get()],
        },
        Create: {
            path: '/',
            method: 'POST',
            middleware: [crud.setOwnership(), controller.preSave, crud.create(editableFields)],
        },
        Update: {
            path: '/:id',
            method: 'PUT',
            middleware: [crud.checkOwnership(), controller.preSave, crud.setOwnership(), crud.update(editableFields)],
        },
        Delete: {
            path: '/:id',
            method: 'DELETE',
            middleware: [crud.checkOwnership(), crud.remove()],
        },
    },
}
