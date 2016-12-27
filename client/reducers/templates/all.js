import {createReducer} from 'redux-immutablejs'
import {fromJS} from 'immutable'
import {typesForCallAPI} from '../../models/helpers/utils'

const initialState = fromJS([])

// list of ids
const all = (modelName, functionName = 'all') => {
    const types = typesForCallAPI(functionName, modelName)
    return createReducer(initialState, {
        [types[1]]: (state, action) => fromJS(action.response.result),
    })
}

export default all
