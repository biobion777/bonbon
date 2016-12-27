'use strict'

const roles = require('../../../config/roles')

/**
 * Check if a user is granted a role.
 * @param {String} role
 * @param {User} user
 * @returns {boolean}
 */
const isGranted = (role, user) => {
    if (!user) {
        return false
    }

    return user.roles.includes(role)
}

module.exports = isGranted
