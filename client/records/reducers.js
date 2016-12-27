import {combineReducers} from 'redux-immutablejs'
import paginate from '../reducers/templates/paginate'

import Record from '../models/Record'

const records = combineReducers({
    pagination: paginate(Record.modelName),
})

export default records
