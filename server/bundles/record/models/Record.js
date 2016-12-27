'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RecordValueSchema = new Schema({
    criterion: {
        type: Schema.Types.ObjectId,
        ref: 'Criterion',
        required: true,
        readable: true,
    },
    value: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
        readable: true,
    },
})

const RecordSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        readable: true,
    },
    values: {
        type: [RecordValueSchema],
        required: true,
        readable: true,
    },
    date: {
        type: String,
        required: true,
        readable: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        readable: true,
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now,
        readable: true,
    },
})

// record date is unique per user
RecordSchema.index({user: 1, date: 1}, {unique: 'There is already a record at this date'})

mongoose.model('Record', RecordSchema)

module.exports = {
    editableFields: 'values date user',
}
