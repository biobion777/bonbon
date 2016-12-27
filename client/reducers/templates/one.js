import {createReducer} from 'redux-immutablejs'
import {fromJS} from 'immutable'
import {typesForCallAPI} from '../../models/helpers/utils'

const initialState = null

// one id
const one = (modelName, functionName = 'one') => {
    const types = typesForCallAPI(functionName, modelName)
    return createReducer(initialState, {
        [types[1]]: (state, action) => fromJS(action.response.result),
    }, false)
}

export default one
