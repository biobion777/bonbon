import {fromJS} from 'immutable'
import {createSelector} from 'reselect'

const getEntities = state => state.get('entities', fromJS({}))

const getCriteria = state => state.get('criteria', fromJS({}))

const getAll = createSelector(
    [getCriteria],
    criteria => criteria.get('all', fromJS({}))
)

const getCriterion = (entities, id) => {
    return entities.getIn(['criteria', id], fromJS({}))
}

export const makeGetCriterion = (id) => {
    return createSelector(
        [getEntities],
        entities => getCriterion(entities, id)
    )
}

export const getAllCriteria = createSelector(
    [getAll, getEntities],
    (all, entities) => all
        .map(id => getCriterion(entities, id))
        .sort((a, b) => a.get('name').localeCompare(b.get('name')))
)
