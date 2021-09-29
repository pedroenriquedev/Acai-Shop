const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price!']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    adress: {
        type: String
    }
});

bookingSchema.pre(/^find/, function (next) {
    if (this.user) {
        this.populate('user');
    }
    next();
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;