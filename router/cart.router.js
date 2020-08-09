//khai báo Router 
var express = require('express');
var router = express.Router();
module.exports = router;

var controller = require('../controllers/cart.controller');

router.get('/add/:bookId', controller.addToCart);