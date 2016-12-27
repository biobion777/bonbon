import {arrayOf} from 'normalizr'
import {fromJS} from 'immutable'
import {decamelizeKeys} from 'humps'
import _merge from 'lodash/merge'
import _isUndefined from 'lodash/isUndefined'
import _isNull from 'lodash/isNull'
import {store} from '../../main'
import {CALL_API} from '../../middlewares/api'
import {typeForAction, typesForCallAPI} from './utils'

/**
 * Helper used to build actions
 */
export default class actionBuilder {
    constructor({modelName, endpoint, schema}) {
        this.modelName = modelName
        this.endpoint = endpoint
        this.schema = schema
        this._typeForAction = functionName => typeForAction(functionName, this.modelName)
        this._typesForCallAPI = functionName => typesForCallAPI(functionName, this.modelName)
    }

    /**
     * Get single item from server
     * @param name
     * @param id
     */
    get(name = 'get', id) {
        const types = this._typesForCallAPI(name)
        return store.dispatch({
            [CALL_API]: {
                method: 'GET',
                types,
                endpoint: `/${this.endpoint}/${id}`,
                schema: this.schema,
            },
        })
    }

    /**
     * Submit item (both for create and update) to server
     * @param name
     * @param data
     * @param id (optional) - the id of the item to update
     */
    submit(name = 'submit', data = fromJS({}), id = data.get('id')) {
        const isUpdate = !_isUndefined(id) && !_isNull(id)
        const types = this._typesForCallAPI(name)

        const config = {
            types,
            schema: {
                data: this.schema,
            },
            body: decamelizeKeys(data.toJS()),
        }

        if (isUpdate) {
            _merge(config, {
                method: 'PUT',
                endpoint: `/${this.endpoint}/${id}`,
            })
        } else {
            _merge(config, {
                method: 'POST',
                endpoint: `/${this.endpoint}`,
            })
        }

        return store.dispatch({
            [CALL_API]: config,
        })
    }

    /**
     * Get all items from server
     * @param name
     */
    getAll(name = 'getAll') {
        const types = this._typesForCallAPI(name)
        return store.dispatch({
            [CALL_API]: {
                method: 'GET',
                types,
                endpoint: `/${this.endpoint}`,
                schema: arrayOf(this.schema),
            },
        })
    }

    /**
     * Get paginated items from server
     * @param name
     */
    paginate(name = 'paginate') {
        const types = this._typesForCallAPI(name)
        return store.dispatch({
            [CALL_API]: {
                method: 'GET',
                types,
                endpoint: `/${this.endpoint}`,
                schema: {
                    data: arrayOf(this.schema),
                },
            },
        })
    }

    /**
     * Custom action trigger
     * @param name
     * @param options
     */
    custom(name, options) {
        const type = this._typeForAction(name)
        return store.dispatch({
            type,
            ...options,
        })
    }

    /**
     * Custom API call trigger
     * @param name
     * @param options - {method, endpoint, schema, ...rest}
     */
    customCallAPI(name, options) {
        const types = this._typesForCallAPI(name)
        return store.dispatch({
            [CALL_API]: {
                types,
                ...options,
                endpoint: `/${this.endpoint}${options.endpoint}`,
            },
        })
    }
}
