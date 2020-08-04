//lấy khai báo lowdb từ db.js
var db = require('../db');
var md5 = require('md5');

module.exports.index = function (req, res) {
    res.render('auth/index');
}

module.exports.postLogin = function (req, res) {
    var email = req.body.email;
    var pass = req.body.password;

    if (!email) {
        errors = 'Email không được để trống';
        res.render('auth/index', {
            errors: errors,
            value: req.body
        });
        return;
    };
    if (!pass) {
        errors = 'Password không được để trống';
        res.render('auth/index', {
            errors: errors,
            value: req.body
        });
        return;
    };

    var user = db.get('users').find({
        email: email
    }).value();

    if (!user) {
        errors = 'Email không tồn tại';
        res.render('auth/index', {
            errors: errors,
            value: req.body
        });
        return;
    }

    var harshPass = md5(pass);

    if (user.pass !== harshPass) {
        errors = 'Password không đúng';
        res.render('auth/index', {
            errors: errors,
            value: req.body
        });
        return;
    }

    res.cookie('userID', user.id);
    if (user.isAdmin === "true") {
        res.cookie('isAdmin', true);
        res.redirect('/users');
    } else {
        res.cookie('isAdmin', false);
        res.redirect('/trans');
    }
}