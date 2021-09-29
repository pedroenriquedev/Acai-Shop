const User = require('../models/userModel');
const AppError = require('../util/appError');

exports.getAllUsers = async (req, res, next) => {
    try {

        const users = await User.find().select('-password');
    
    res.status(201).json({
        status: 'sucess',
        data: users
    })
    }
    catch(err) {next(err)}
}

exports.deleteUser = async (req,res,next) => {
    try {
        
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) return next( new AppError('User not found'));
        res.status(204).json({
            status: 'succes',
            user
        })
    } catch (err) {
        next(err)
    }
}