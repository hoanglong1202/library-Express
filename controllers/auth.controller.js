//lấy khai báo lowdb từ db.js
var db = require('../db');
var bcrypt = require('bcrypt');

//SendGrid mail khi nhập sai pass quá nhiều
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    //lấy số lần đăng nhập sai của user
    var checkLegit = Number(user.wrongLoginCount);
    if (checkLegit > 4) {
        //tạo message nếu nhập sai hơn 4 lần
        const msg = {
            to: user.email,
            from: 'cyberpunk2076@gmail.com',
            subject: 'From Long đẹp zai with Love',
            text: 'Sai pass nhiều quá bạn ei',
            html: '<strong>Nah, bye bye</strong>',
        };
        //gửi message
        //sgMail.send(msg);
        console.log(msg);
        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();
        return res.render('404');
    }

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
    });

    //nếu pass nhập đúng
    //server gửi cookie cho client
    res.cookie('userID', user.id, {
        signed: true
    });

    //set lại số lần nhập sai pass
    var countWrong = 0;
    db.get('users').find({
        email: email
    }).assign({
        wrongLoginCount: countWrong
    }).write();

    if (user.isAdmin === true) {
        res.cookie('isAdmin', true, {
            signed: true
        });
        res.redirect('/users');
    } else {
        res.cookie('isAdmin', false, {
            signed: true
        });
        res.redirect('/trans');
    }
}