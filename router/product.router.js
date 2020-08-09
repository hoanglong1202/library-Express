//khai báo Router 
var express = require('express');
var router = express.Router();

//Khai bao controller
var controller = require('../controllers/products.controller');
router.get('/', controller.index);

module.exports = router;