//khai báo Router 
var express = require('express');
var router = express.Router();
module.exports = router;

var controller = require('../controllers/auth.controller');

router.get('/', controller.index);
router.post('/', controller.postLogin);