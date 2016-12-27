import React from 'react'
import actionBuilder from './helpers/actionBuilder'
import {Schemas} from '../middlewares/api'

const modelName = 'criterion'
const endpoint = 'criteria'
const schema = Schemas.CRITERION
const helper = new actionBuilder({modelName, endpoint, schema})

const Criterion = {
    modelName,
    get(id) {
        return helper.get('get', id)
    },
    submit(data, id) {
        return helper.submit('submit', data, id)
    },
    getAll() {
        return helper.getAll('all')
    },
    renderIcon(criterion) {
        return (
            <div className="criterion-icon" style={{backgroundColor: criterion.get('color')}}>
                <i className={`fa fa-fw fa-${criterion.get('icon')}`}/>
            </div>
        )
    },
}

export default Criterion
