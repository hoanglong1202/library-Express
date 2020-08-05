var db = require('../db');
module.exports.requireAuth = function (req, res, next) {
    if (!req.signedCookies.userID) {
        res.redirect('/auth/login');
        return;
    };

    var user = db.get('users').find({
        id: req.signedCookies.userID
    }).value();

    if (!user) {
        res.redirect('/auth/login');
        return;
    };

    //set biến local
    res.locals.user = user;

    next();
}

module.exports.isAdmin = function (req, res, next) {
    // route nao ma khong muon nguoi dung binh thuong access thi them cai middleware nay vao
    if (req.signedCookies.isAdmin === false) {
        return res.render('404');
    }
    return next();
}