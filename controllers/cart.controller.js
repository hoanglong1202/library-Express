//lấy khai báo lowdb từ db.js
var db = require('../db');

module.exports.index = function (req, res) {

    if (req.signedCookies.sessionId) {
        //count product in cart
        var sessionCart = db.get('session').find({
            id: req.signedCookies.sessionId
        });
        var count = 0;
        var data = sessionCart.get('cart').value();
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                count += value;
            }
        }

        //get Array of Book Name
        var books = [];
        for (key in data) {
            var value = data[key];
            var bookName = db.get('books').find({
                id: key
            }).get('title').value();
            var pic = db.get('books').find({
                id: key
            }).get('coverUrl').value();
            var book = {
                id: key,
                title: bookName,
                quantity: value,
                coverUrl: pic
            }
            books.push(book);
        }
    }

    res.render('cart/index', {
        totalBook: count,
        books: books
    });
}

module.exports.addToCart = function (req, res) {
    var bookId = req.params.bookId;
    var sessionId = req.signedCookies.sessionId;

    if (!sessionId) {
        res.redirect('/product');
        return;
    }

    var count = db.get('session').find({
        id: sessionId,
    }).get('cart.' + bookId, 0).value();

    db.get('session').find({
        id: sessionId,
    }).set('cart.' + bookId, count + 1).write();

    res.redirect('/product');
}

module.exports.deleteItem = function (req, res) {
    var bookId = req.params.bookId;
    var sessionId = req.signedCookies.sessionId;

    if (!sessionId) {
        res.redirect('/product');
        return;
    }

    db.get('session').find({
        id: sessionId,
    }).unset('cart.' + bookId).write();

    res.redirect('/cart');
}

module.exports.checkout = function (req, res) {
    var sessionId = req.signedCookies.sessionId;
    var userId = req.signedCookies.userID;

    var sessionCart = db.get('session').find({
        id: sessionId
    });
    var data = sessionCart.get('cart').value();

    var user = {
        id: userId,
        cart: data
    };

    db.get('transactions').push(user).write();

    db.get('session').remove({ id: sessionId }).write();

    res.render('cart/delete');
}