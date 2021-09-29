const express = require('express');
const acaiController = require('../controllers/acaiController');
const authController =  require('../controllers/authController');

const router = express.Router({mergeParams: true});

// see if there's an id coming from the params
// if so, check if id coming from there is the same
// as the req.user
router.route('/').
get(acaiController.getAllAcai).
post(authController.protect,acaiController.createAcai);

router.route('/:id').
get(acaiController.getOneAcai).
patch(acaiController.updateAcai).
delete(acaiController.deleteAcai);

module.exports = router;