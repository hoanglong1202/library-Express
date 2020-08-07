//khai báo Router 
var express = require('express');
var router = express.Router();

//Khai báo Multer dùng để upload file img
var multer = require('multer');
var upload = multer({
    dest: './public/uploads/'
});

//lấy các function từ book.controller
var controller = require('../controllers/book.controller');
var validate = require('../validate/book.validate')

//sử dụng function
router.get('/', controller.index);

router.get('/search', controller.search);

router.get('/create', controller.create);

router.post('/create', upload.single('coverUrl'), validate.postCreate, controller.postCreate);

router.get('/:id', controller.view);

router.get('/:id/delete', controller.delete);

router.get('/:id/update', controller.update);

router.post('/:id/update', upload.single('coverUrl'), controller.postUpdate);

module.exports = router;