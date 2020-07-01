//lấy khai báo lowdb từ db.js
var db = require('../db');
const shortid = require('shortid');

//trang index của books
module.exports.index = function (req, res) {
    res.render('books/index', {
        books: db.get('books').value()
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
    res.render('books/create')
};

//POST dữ liệu từ form vừa nhập lên server
module.exports.postCreate = function (req, res) {
    req.body.id = shortid.generate();
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
module.exports.postUpdate = function (req, res) {
    var id = req.params.id;
    db.get('books').find({ id: id }).assign({title: req.body.title, description: req.body.description}).write(); 
    res.redirect('/books');
};