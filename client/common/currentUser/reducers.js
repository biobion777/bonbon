import one from '../../reducers/templates/one'

import CurrentUser from '../../models/CurrentUser'

const currentUser = one(CurrentUser.modelName, 'get')

export default currentUser
