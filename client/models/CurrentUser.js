import React from 'react'
import actionBuilder from './helpers/actionBuilder'
import {Schemas} from '../middlewares/api'

const modelName = 'currentUser'
const endpoint = 'users/me'
const schema = Schemas.USER
const helper = new actionBuilder({modelName, endpoint, schema})

const CurrentUser = {
    modelName,
    get() {
        return helper.customCallAPI('get', {
            method: 'GET',
            endpoint: '',
            schema,
        })
    },
    update(data) {
        return helper.submit('submit', data)
    },
}

export default CurrentUser
