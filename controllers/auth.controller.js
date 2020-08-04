//lấy khai báo lowdb từ db.js
var db = require('../db');
var md5 = require('md5');
var bcrypt = require('bcrypt');

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

    var checkLegit = Number(user.wrongLoginCount);
    console.log(checkLegit);
    if (checkLegit > 4){
        return res.render('404');
    }

    // bcrypt.hash('123123', 10,function(err, hash) {
    //     console.log(hash);
    // });

    bcrypt.compare(pass, user.pass, function (err, result) {
        if (!result) {
            //set số lần nhập sai pass
            var countWrong = Number(user.wrongLoginCount);
            countWrong++;
            db.get('users').find({
                email: email
            }).assign({
                wrongLoginCount: countWrong
            }).write();

            errors = 'Password không đúng';
            res.render('auth/index', {
                errors: errors,
                value: req.body
            });
            return;
        }

        //nếu pass nhập đúng
        //server gửi cookie cho client
        res.cookie('userID', user.id);

        //set lại số lận nhập sai pass
        var countWrong = 0;
        db.get('users').find({
            email: email
        }).assign({
            wrongLoginCount: countWrong
        }).write();

        if (user.isAdmin === "true") {
            res.cookie('isAdmin', true);
            res.redirect('/users');
        } else {
            res.cookie('isAdmin', false);
            res.redirect('/trans');
        }
    });


}