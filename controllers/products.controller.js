//lấy khai báo lowdb từ db.js
var db = require('../db');

module.exports.index = function (req, res) {
    //pagination
    var page = parseInt(req.query.page) || 1;
    var perPage = 4;
    var begin = (page - 1) * perPage;
    var end = page * perPage;
    var total = Math.ceil(Object.keys(db.get('books').value()).length / perPage);

    //count product in cart
    if (req.signedCookies.sessionId) {
        var sessionCart = db.get('session').find({
            id: req.signedCookies.sessionId
        });
        var cartLength = sessionCart.get('cart').size().value();
        var valueArray = Object.values(sessionCart.get('cart').value());
        var count = 0;
        var data = sessionCart.get('cart').value();
        for(key in data) {
            if(data.hasOwnProperty(key)) {
                var value = data[key];
                count += value;
            }
        }
    }
    res.render('products/index', {
        totalBook: count,
        totalPage: total,
        books: db.get('books').value().slice(begin, end)
    })
}