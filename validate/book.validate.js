module.exports.postCreate = function (req, res, next) {
    var errors = [];
    if (!req.body.title)
        errors.push('Title không được để trống');
    if (!req.body.description)
        errors.push('Description không được để trống');
    if (errors.length) {
        res.render('books/create', {
            errors: errors,
            values: req.body
        });
        return;
    }
    next();
}