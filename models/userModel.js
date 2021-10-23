const mongoose = require('mongoose');
const validator =  require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        minLength: 1,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true, 
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please provide a password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        },
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    address: String,
    city: String,
    state: String,
    zip: Number,
    providedAddress: {
        type: Boolean,
        default: false
    }
}); 

userSchema.pre('save', function(next) {
    if (!this.isModified || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 3000;

    next();
})

userSchema.pre('save', async function(next) {
    // only run this code if password was actually modified, since we can use save for changing
    // fields like email / username / name
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
})

userSchema.methods.isPasswordCorrect = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.createPasswordResetToken = async function() {
    // create resetToken
    const resetToken = crypto.randomBytes(32).toString('hex');
    // harsh it in order to save in the DB
    // save in the DB
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    this.passwordResetExpires = Date.now() + 10*60*1000;
    
    return resetToken;
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {

    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimeStamp;
    }

    return false;
}

const User =  mongoose.model('User', userSchema);

module.exports = User;