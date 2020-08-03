var db = require('../db');
module.exports.requireAuth = function (req, res, next) {
    if (!req.cookies.userID) {
        res.redirect('/auth/login');
        return;
    };

    var user = db.get('users').find({
        id: req.cookies.userID
    }).value();

    if (!user) {
        res.redirect('/auth/login');
        return;
    };
    next();
}

module.exports.isAdmin = function(req, res, next) { 
    // route nao ma khong muon nguoi dung binh thuong access thi them cai middleware nay vao
    if (req.cookies.isAdmin === 'false') {
        return res.render('404');
    }
    return next();
}