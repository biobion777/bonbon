import {fromJS} from 'immutable'
import moment from 'moment'
import {createSelector} from 'reselect'

import Record from '../models/Record'

const getEntities = state => state.get('entities', fromJS({}))

const getRecords = state => state.get('records', fromJS({}))

const getPagination = createSelector(
    [getRecords],
    records => records.get('pagination', fromJS({}))
)

// adding record values to records
const getRecord = (entities, recordId) => {
    // get record
    const record = entities.getIn(['records', recordId], fromJS({}))
    // merge its record values (which is another entity)
    const values = record
        .get('values', fromJS([]))
        .map(value => entities.getIn(['recordValues', value], fromJS({})))

    return record.set('values', values)
}

// adding record values to records
const getRecordByDate = (entities, date) => {
    const record = entities
        .get('records', fromJS({}))
        .find(record => record.get('date') === date, null, fromJS({}))

    if (record.isEmpty()) {
        return fromJS({})
    }

    return getRecord(entities, record.get('id'))
}

export const makeGetRecord = (id) => {
    return createSelector(
        [getEntities],
        entities => getRecord(entities, id)
    )
}

export const makeGetRecordByDate = (date) => {
    return createSelector(
        [getEntities],
        entities => getRecordByDate(entities, date)
    )
}

// return records paginated by date on a period of time
export const getPaginatedRecords = createSelector(
    [getPagination, getEntities],
    (pagination, entities) => {
        const startDate = moment(pagination.get('startDate', moment().toDate()), Record.getDateFormat())
        const endDate = moment(pagination.get('endDate', moment().toDate()), Record.getDateFormat())

        // get paginated records received from server
        const records = pagination
            .get('data')
            .map(id => getRecord(entities, id))
            .sort((a, b) => b.get('date').localeCompare(a.get('date')))

        // map paginated records by their date
        let recordsByDate = fromJS({})
        records.forEach(record => {
            recordsByDate = recordsByDate.set(record.get('date'), record)
        })

        // generate new page with dates
        let items = fromJS([])
        let dateIterator = moment(startDate)
        while (!dateIterator.isSameOrBefore(endDate, 'day')) {
            const identifier = dateIterator.format(Record.getDateFormat())
            items = items.push(fromJS({
                date: identifier,
                record: recordsByDate.get(identifier)
            }))
            dateIterator = dateIterator.subtract(1, 'days')
        }

        return items
    }
)
