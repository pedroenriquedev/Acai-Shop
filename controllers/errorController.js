const AppError = require('../util/appError');

const handleCastErrorDB = err => {
    const msg = `Invalid ${err.path}: ${err.value}`;
    return new AppError(msg, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const msg = `Duplicated field value: ${value}. Please use another value!`;
    return new AppError(msg, 400);
}

const handleValidationErrorDB = err => {
    const msg = err.message;
    return new AppError(msg, 400);
}

const handleJWTError = err => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again!', 401);

const sendErrDev = (err, req, res) => {
    console.log('--ERROR IN DEVELOPMENT--')
    console.log(err);
    // api
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })   
    } else {
        // rendered website
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
}

const sendErrProd = (err, req, res) => {
    // api
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        } else {
            
            console.log('UNKNOWN ERROR!!', err);
            
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            })
        }
    } else {
        // rendered website
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: 'Please try again later.'
        })
    }
    
   
    
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if (process.env.NODE_ENV == 'development') {
        sendErrDev(err, req, res);
    } else if (process.env.NODE_ENV == 'production') {
        
        
        let error = {...err, message: err.message};
        
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        sendErrProd(error, req, res);
        
    }
}