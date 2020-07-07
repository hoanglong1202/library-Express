module.exports.postCreate = function (req, res, next) {
    //validate
    var errors;
    if (!req.body.name)
        errors = 'Tên không được để trống';
    if (req.body.name.length > 30)
        errors = 'Tên không được quá 30 ký tự';

    if (errors) {
        res.render('users/create', {
            errors: errors
        });
        return;
    }
    next();
}