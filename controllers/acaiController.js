const Acai = require('../models/acaiModel');
const AppError = require('../util/appError');
const APIFeatures =  require('../util/apiFeatures');
const User = require('../models/userModel');

exports.getAllAcai = async (req, res, next) => {
    try {
        
        const query = new APIFeatures(Acai.find(), req.query).filter().sort().select().paginate();
        
        const AllAcai = await query.query;
        res.status(200).json({
            status: 'success',
            data: { 
                results: AllAcai.length,
                data: AllAcai
            }
        })
    }
    catch(err) {
        next(err);
    }
    
}

exports.getOneAcai = async (req, res, next) => {
    try {
        const acai = await Acai.findById(req.params.id);
        res.status(201).json({
            status: 'success',
            data: {
                data: acai
            }
        })
    }
    catch(err) {
        next(new AppError('No acai found with that id!', 404));
    }
}

exports.createAcai = async (req, res, next) => {
    
    try {
        const newDocQuery = Acai.create(req.body); 
        let newDoc;
        // if this is a favoriteAcai call, execute the code below
        if(req.params.id) {
            const user = req.user;
            
            if (req.params.id !== (user.id).toString()) return next(new AppError('User logged in must be the same user creating an acai', 400));

            newDoc = await newDocQuery;
            
            req.user.favoriteAcais.push(newDoc.id);

            req.user.save();  
            
            
        } else {
            newDoc = await newDocQuery;
        }
        
        res.status(201).json({
            status: 'success',
            data: {
                data: newDoc
            }
        })
    }
    catch(err)  {
        console.log(err);
        next(new AppError(err._message, 400));
    }
} 

exports.updateAcai = async (req, res, next) => {
    
    try {
        const acai = await Acai.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(201).json({
            status: 'success',
            data: {
                data: acai
            }
        })
    }
    catch(err) {
        next(new AppError('No acai found with that id!', 404));
    }
}

exports.deleteAcai = async (req, res, next) => {
    try {
        const acai = await Acai.findByIdAndDelete(req.params.id);
        
        if (!acai) return next();
        
        res.status(204).json({
            status: 'success',
            data: {
                data: null
            }
        })
    }
    catch(err) {
        next(new AppError('No acai found with that id!', 404));
    }
}