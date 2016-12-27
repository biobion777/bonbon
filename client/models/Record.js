import {arrayOf} from 'normalizr'
import moment from 'moment'
import actionBuilder from './helpers/actionBuilder'
import {Schemas} from '../middlewares/api'

const modelName = 'record'
const endpoint = 'records'
const schema = Schemas.RECORD
const helper = new actionBuilder({modelName, endpoint, schema})

const Record = {
    modelName,
    get(id) {
        return helper.get('get', id)
    },
    getByDate(date) {
        return helper.customCallAPI('getByDate', {
            method: 'GET',
            endpoint: '/at/' + date,
            schema,
        })
    },
    submit(data, id) {
        return helper.submit('submit', data, id)
    },
    paginate({l: l = 20, p: p = 1} = {l, p}) {
        return helper.customCallAPI('paginate', {
            method: 'GET',
            endpoint: '/mine',
            schema: {
                data: arrayOf(schema),
            },
            params: {
                l,
                p,
                startDate: moment().format('YYYY-MM-DD'),
            },
        })
    },
    paginateAll() {
        return helper.paginate('paginateAll')
    },
    getDateFormat: () => 'YYYY-MM-DD',
    renderDate(record) {
        return moment(record.get('date')).format('MM/DD/YYYY')
    },
}

export default Record
