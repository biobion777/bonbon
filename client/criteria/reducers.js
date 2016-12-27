import {combineReducers} from 'redux-immutablejs'
import all from '../reducers/templates/all'

import Criterion from '../models/Criterion'

const criteria = combineReducers({
    all: all(Criterion.modelName),
})

export default criteria
