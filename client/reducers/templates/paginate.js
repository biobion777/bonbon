import {createReducer} from 'redux-immutablejs'
import {fromJS} from 'immutable'
import {typesForCallAPI} from '../../models/helpers/utils'

const initialState = fromJS({
    count: 1,
    page: 1,
    perPage: 50,
    totalPages: 1,
    prev: null,
    next: null,
    data: [],
    // ... and maybe some custom properties
})

// pagination
const paginate = (modelName, functionName = 'paginate', reducer) => {
    const types = typesForCallAPI(functionName, modelName)
    return createReducer(initialState, reducer ? reducer(types) : {
        [types[1]]: (state, action) => fromJS(action.response.result),
    })
}

export default paginate
