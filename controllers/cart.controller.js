//lấy khai báo lowdb từ db.js
var db = require('../db');

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