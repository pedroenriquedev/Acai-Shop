const express = require('express');
const Base64 = require('js-base64');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', (req, res) => {
    if (Object.keys(req.query).length === 0) {
        const item = {
            addOns: { 
                fruits: [-1, -1, -1, -1, -1, -1],
                toppings: [-1, -1, -1, -1, -1, -1],
                drizzle: [-1, -1, -1, -1, -1, -1],
                powder: [-1, -1, -1, -1, -1, -1],
            } 
        };
        res.status(200).render('selectAcai', {
            item
        });
    } else {
        let str = Base64.decode(req.query.item);
        const item = JSON.parse(str);

        res.status(200).render('selectAcai', {
            item
        });
    }
    
    
});

router.get('/reviewOrder', (req, res) => {

    let str = Base64.decode(req.query.items);
    const items = JSON.parse(str);

    res.status(200).render('shoppingCart', {
        items
    });
});

router.get('/login', (req,res) => {  
    if (res.locals.user) return res.redirect('/')
    res.status(200).render('login', {});
}) 

router.get('/resetPassword', (req, res) => {  
        if (res.locals.user) return res.redirect('/');  
        res.status(200).render('resetPassword', {});
})

router.get('/forgotPassword', (req, res) => {  
    if (res.locals.user) return res.redirect('/');  
    res.status(200).render('forgotPassword', {});
})

router.get('/reviewAddress', (req, res) => {
    res.status(200).render('reviewAddress');
})

module.exports = router;