//khai báo Router 
var express = require('express');
var router = express.Router();
module.exports = router;

//lấy các function từ book.controller
var controller = require('../controllers/book.controller');

//sử dụng function
router.get('/', controller.index);

router.get('/search', controller.search);

router.get('/create', controller.create);

router.post('/create', controller.postCreate);

router.get('/:id', controller.view);

router.get('/:id/delete', controller.delete);

router.get('/:id/update', controller.update);

router.post('/:id/update', controller.postUpdate);