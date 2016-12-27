import {combineReducers} from 'redux-immutablejs'
import {reducer as formReducer} from 'redux-form/immutable'
import {reducer as uiReducer} from 'redux-ui'
import {fromJS} from 'immutable'
import {camelize} from 'humps'
import {LOCATION_CHANGE} from 'react-router-redux'
import {loadingSuffixes} from '../config'

// common reducers (used in entire app)
import currentUser from '../common/currentUser/reducers'

// domain reducers (per pages)
import criteria from '../criteria/reducers'
import records from '../records/reducers'

const entitiesNames = 'users records recordValues criteria'.split(' ')
const initialEntities = fromJS(entitiesNames).reduce((object, name) => {
    return object.set(name, fromJS({}))
}, fromJS({}))

// Updates an entity cache in response to any action with response.entities.
const entities = (state = initialEntities, action) => {
    if (action.response && action.response.entities) {
        return state.mergeDeep(action.response.entities)
    }

    return state
}

// loading reducer
const loading = (state = fromJS({}), action) => {
    const isCallAPIAction = loadingSuffixes.some(suffix => action.type.endsWith(suffix))

    if (isCallAPIAction) {
        const isStartingLoading = action.type.endsWith(loadingSuffixes[0])
        const actionName = action.type.split('_').slice(0, -1).join('_').toLowerCase()
        const loadingKey = camelize(actionName)
        return state.set(loadingKey, isStartingLoading)
    }

    return state
}

// router configured for immutable JS
const initialRouting = fromJS({
    locationBeforeTransitions: null,
})
const routerReducer = (state = initialRouting, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.merge({
            locationBeforeTransitions: action.payload,
        })
    }

    return state
}

const rootReducer = combineReducers({
    entities,
    loading,
    ui: uiReducer,
    form: formReducer,
    routing: routerReducer,
    criteria,
    records,
    currentUser,
})

export default rootReducer
