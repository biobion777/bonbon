import {fromJS} from 'immutable'
import {createSelector} from 'reselect'

const getEntities = state => state.get('entities', fromJS({}))

const getCurrentUserId = state => state.get('currentUser')

export const isLoggedIn = createSelector(
    [getCurrentUserId],
    currentUserId => !!currentUserId
)

export const getCurrentUser = createSelector(
    [getCurrentUserId, getEntities],
    (currentUserId, entities) => entities.getIn(['users', currentUserId], fromJS({}))
)
