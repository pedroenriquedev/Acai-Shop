const mongoose = require('mongoose');

const acaiSchema = new mongoose.Schema({
    size: {
        type: Number,
        required: [true, 'An acai must have a size'],
        min: 0,
        max: 3
    },
    name : {
        type: String,
        required: [true, 'An acai must have a name!'],
        trim: true,
        minLength: 1,
        maxLength: 15,
    },
    instructions : {
        type: String,
        required: false,
        trim: true,
        maxLength: 500,
    },
    addOns: {
        drizzle: {
            type: Array,
            default: [-1, -1, -1, -1, -1, -1]
        },
        fruits: {
            type: Array,
            default: [-1, -1, -1, -1, -1, -1]
        },
        powder: {
            type: Array,
            default: [-1, -1, -1, -1, -1, -1]
        },
        toppings: {
            type: Array,
            default: [-1, -1, -1, -1, -1, -1]
        }
    }
})

const Acai = mongoose.model('Acai', acaiSchema);

module.exports = Acai;