const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../util/appError');
const { promisify } = require('util');
const Email = require('../util/email');
const crypto = require('crypto');

const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = generateToken(user._id);
    
    const cookieOptions = {
        httpOnly: true
    };
    
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    
    res.cookie('jwt', token, cookieOptions);
    
    
    
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        
        const url = `${req.protocol}://${req.get('host')}`
        await new Email(newUser, url).sendWelcome();

        createSendToken(newUser, 201, res);
        
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(new AppError('Please provide an email and password!', 404));
    }
    
    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.isPasswordCorrect(password, user.password))) {
            return next(new AppError('Incorrect email or password!', 404));
        }  
        
        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
    
    
    
}

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
      
    if (!token) return next(new AppError('Please log back in!', 400));
    
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // checking if user still exists
        const currentUser = await User.findById(decoded.id);
        
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.'))
        }

        // checking if user changed password after token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        };

        // grant access to protected route
        req.user = currentUser;
        res.locals.user =  currentUser;
        next();
    } catch (err) {
        next(err);
    }
}

// only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
    
    try {
        if (req.cookies.jwt) {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            
            const currentUser = await User.findById(decoded.id).select('-password');
            
            if (!currentUser) {
                return next()
            }
            //there is a logged in user
            
            res.locals.user = currentUser;
            req.user = currentUser;
            return next();
        }
        next();
    } catch (err) {
        next();
    }
}

exports.logout = async (req, res, next) => {
    try {
        res.cookie('jwt', 'logged out', {
            expires: new Date(Date.now() + 10 * 1000)
        })
        
        res.status(200).json({ message: 'success' })
    } catch (err) {
        next(err);
    }
}

exports.forgotPassword = async(req, res, next) => {
    try {
        // get user based on posted email
        const user = await User.findOne({email: req.body.email});
        
        if (!user) return next(new AppError('No user found with that email address!', 404));
        // generate random token
        const resetToken = await user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});
        
        // send back as email
        const url = `${req.protocol}://${req.get('host')}/resetPassword?token=${resetToken}`
        await new Email(user, url).sendResetToken();
        res.status(200).json({
            message: "success"
        })
    } catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => {

    try {
        // get user based on token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}}).select('-password');
        
        // if token has not expired, and there is a user
        if (!user) {
            return next(new AppError('Token is invalid or has expired!', 400));
        }
        user.password = req.body.newPassword;
        user.passwordConfirm = req.body.newPasswordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // update changedPasswordAt property for the user
        user.changedPasswordAt = Date.now();
        // log user in, send JWT
        await user.save();

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
}