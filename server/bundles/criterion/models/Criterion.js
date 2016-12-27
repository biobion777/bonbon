'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CriterionSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'The name is required'],
        readable: true,
    },
    type: {
        type: String,
        trim: true,
        required: true,
        default: 'range',
        enum: ['range', 'event'],
        readable: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        readable: true,
    },
    default_value: {
        type: Number,
        min: [0, 'The default value can not be less than 0'],
        max: [10, 'The default value can not be greater than 10'],
        required: [true, 'You need to set a default value'],
        readable: true,
        default: 0,
    },
    color: {
        type: String,
        trim: true,
        required: [true, 'You need to set a color'],
        readable: true,
        validate: {
            validator: value => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
            message: '{VALUE} should be an hexadecimal color code (like #00bcd4)',
        },
    },
    icon: {
        type: String,
        trim: true,
        required: [true, 'You need to set an icon'],
        readable: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        readable: true,
    },
})

// criterion name is unique per user
CriterionSchema.index({user: 1, name: 1}, {unique: 'This name is already used in another criterion'})

mongoose.model('Criterion', CriterionSchema, 'criteria')

module.exports = {
    editableFields: 'name default_value type color icon user',
}
