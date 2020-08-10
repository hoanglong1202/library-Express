//khai báo Router 
var express = require('express');
var router = express.Router();
module.exports = router;

var controller = require('../controllers/cart.controller');
var middleware = require('../middleware/auth.middleware');

router.get('/', controller.index);
router.get('/add/:bookId', controller.addToCart);
router.get('/:bookId/delete', controller.deleteItem);
router.get('/checkout', middleware.requireAuth, controller.checkout);