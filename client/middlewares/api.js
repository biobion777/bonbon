import {Schema, arrayOf, normalize} from 'normalizr'
import {camelizeKeys} from 'humps'
import Immutable from 'immutable'
import $ from 'jquery'
import NProgress from 'react-nprogress'
import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'
import _isNumber from 'lodash/isNumber'
import _size from 'lodash/size'
import _every from 'lodash/every'

/**
 * Build a call API and execute it
 * @param action
 * @param schema
 * @returns {*}
 */
const callApi = (action, schema) => {
    const {
        endpoint,
        method = 'GET',
        params = {},
    } = action
    let {
        body = {},
    } = action
    let url = '/api' + endpoint

    const options = {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    }

    // request body
    if (body && !['GET', 'HEAD'].includes(method)) {
        // if body is immutable, make it a JS object
        if (Immutable.Iterable.isIterable(body)) {
            body = body.toJS()
        }

        options.body = JSON.stringify(body)
    }

    // request params
    if (_size(params)) {
        url += '?' + $.param(params)
    }

    return fetch(url, options)
        .then(response =>
            response.json().then((json) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }

                const camelizedJson = camelizeKeys(json)

                if (!schema) {
                    return {
                        result: camelizedJson,
                    }
                }

                return normalize(camelizedJson, schema)
            })
        )
}

// SCHEMAS
const userSchema = new Schema('users')
const recordSchema = new Schema('records')
const recordValueSchema = new Schema('recordValues')
const criterionSchema = new Schema('criteria')

recordSchema.define({
    user: userSchema,
    values: arrayOf(recordValueSchema),
})

criterionSchema.define({
    user: userSchema,
})

export const Schemas = {
    USER: userSchema,
    USER_ARRAY: arrayOf(userSchema),
    RECORD: recordSchema,
    RECORD_ARRAY: arrayOf(recordSchema),
    CRITERION: criterionSchema,
    CRITERION_ARRAY: arrayOf(criterionSchema),
}

// Action key that carries API call info interpreted by this Redux middleware
export const CALL_API = Symbol('Call API')

export default store => next => (action) => {
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let {endpoint} = callAPI
    const {schema, params = {}, types} = callAPI

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL')
    }

    if (!_isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types')
    }

    if (!types.every(_isString)) {
        throw new Error('Expected action types to be strings')
    }

    if (_size(params) && !_every(params, param => _isNumber(param) || _isString(param) || _isArray(param))) {
        throw new Error('Expected query params to be strings, numbers or arrays')
    }

    const actionWith = (data) => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }

    const [requestType, successType, failureType] = types
    next(actionWith({type: requestType}))

    // start loading progress bar
    NProgress.start()

    return callApi(callAPI, schema)
        .then(
            (response) => {
                NProgress.done()
                return next(actionWith({
                    response,
                    type: successType,
                }))
            },
            (error) => {
                NProgress.done()
                return next(actionWith({
                    type: failureType,
                    error: error.message || 'Something bad happened',
                    errors: error.errors || [],
                }))
            }
        )
}
