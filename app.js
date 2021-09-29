const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');
const acaiRouter = require('./routes/acaiRoute');
const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoute');
const bookingRouter = require('./routes/bookingRoute');
const rateLimit =  require('express-rate-limit')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp =  require('hpp');

const app = express();

// security HTPP headers
app.use(helmet({
    contentSecurityPolicy: false
}));

// serving static files
app.use(express.static(`${__dirname}/public`));

// limit request from same ip
const limiter = rateLimit({
    max: 1000,
    windowMs: 60*60*1000,
    message: 'Too many request from this IP. Please try again in an hour!'
})

app.use('/api' , limiter);

//console.log(__dirname)  



app.use(cookieParser());
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

// body parser reading data from body into req.body
app.use(
    express.json({ 
        limit: '50kb', 
    })
)

// data sanitization against NoSQL query injection
//app.use(mongoSanitize());

//data sanitization against XSS
//app.use(xss());

//prevent parameter pollution
// app.use(hpp({
//     whitelist: []
// }));

// app.use(hpp({
//     whitelist: []
// }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})




app.use('/', viewRouter);

app.use('/api/v1/acai', acaiRouter);
app.use('/api/v1/user', userRouter); 
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) =>{
    next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;
