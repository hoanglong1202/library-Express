//reuire dotenv
require('dotenv').config();
//lấy khai báo lowdb từ db.js
var db = require('../db');
const shortid = require('shortid');
//khai báo cloudinary để up ảnh
var cloudinary = require('cloudinary');

//trang index của books
module.exports.index = function (req, res) {
    //pagination
    var page = parseInt(req.query.page) || 1;
    var perPage = 2;
    var begin = (page - 1) * perPage;
    var end = page * perPage;
    var total = Math.ceil(Object.keys(db.get('books').value()).length / perPage);
    var test = db.get('books').value();
    var count = "";
    test.forEach(ele => {
        count += ele.title + "; ";
    });
    console.log(count);
    res.render('books/index', {
        totalPage: total,
        books: db.get('books').value().slice(begin, end)
    });
};

module.exports.search = function (req, res) {
    var q = req.query.q;
    var booksList = db.get('books').value();
    var matchbooks = booksList.filter(function (book) {
        return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });

    res.render('books/index', {
        books: matchbooks
    });
};

//đưa đến trang create để nhập dữ liệu vào form
module.exports.create = function (req, res) {
    res.render('books/create');
};

//POST dữ liệu từ form vừa nhập lên server
module.exports.postCreate = async function (req, res) {
    req.body.id = shortid.generate();
    let imgURL = await cloudinary.uploader.upload(req.file.path, result => {
        return result;
    });
    req.body.coverUrl = imgURL.url;
    db.get('books')
        .push(req.body)
        .write();
    res.redirect('/books');
};

module.exports.view = function (req, res) {
    var id = req.params.id;
    var book = db.get('books').find({
        id: id
    }).value();

    res.render('books/view', {
        book: book
    });
};

module.exports.delete = function (req, res) {
    var id = req.params.id;
    db.get('books').remove({
        id: id
    }).write();;

    res.render('books/delete');
};

//đưa đến trang update để nhập dữ liệu vào form
module.exports.update = function (req, res) {
    var id = req.params.id;
    var book = db.get('books').find({
        id: id
    }).value();

    res.render('books/update', {
        book: book
    });
};

//POST dữ liệu từ form vừa nhập lên server
module.exports.postUpdate = async function (req, res) {
    var id = req.params.id;
    let imgURL = await cloudinary.uploader.upload(req.file.path, result => {
        return result;
    });
    req.body.coverUrl = imgURL.url;
    db.get('books').find({
        id: id
    }).assign({
        title: req.body.title,
        description: req.body.description,
        coverUrl: req.body.coverUrl
    }).write();
    res.redirect('/books');
};