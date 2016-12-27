'use strict'

const mongoose = require('mongoose')
const idUtils = require('../../../services/idUtils')
const validators = require('../../../services/validators')

const Schema = mongoose.Schema

const isSelf = (entity, user) => {
    return idUtils.eq(entity, user)
}

const GoogleAuthschema = new Schema({
    id: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
}, {_id: false})

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        readable: true,
    },
    email: {
        type: String,
        trim: true,
        readable: [isSelf, 'ADMIN'],
    },
    gender: {
        type: String,
        validate: [validators.gender],
        readable: [isSelf, 'ADMIN'],
    },
    last_login: {
        type: Date,
        default: Date.now,
        readable: [isSelf, 'ADMIN'],
    },
    google: {
        type: GoogleAuthschema,
    },
    roles: {
        type: [String],
        default: [],
        readable: true,
    },
})

UserSchema.pre('save', function (next) {
    this.username = this.google.name
    this.email = this.google.email
    this.gender = this.google.gender
    next()
})

mongoose.model('User', UserSchema)
