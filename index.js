var port = 3000;

//khai báo Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Khai báo Router
const userRoute = require('./router/user.router');
const bookRoute = require('./router/book.router');
const transRouter = require('./router/trans.router');

//thiết lập template PUG
app.set('view engine', 'pug');
app.set('views', './view');

app.get('/', function (req, res) {
    res.render('index', {
        name: 'Accel'
    });
});

//khai báo thư mực static files 
app.use(express.static('public'));

//sử dụng router
app.use('/users', userRoute);
app.use('/books', bookRoute);
app.use('/trans', transRouter);

//notification của server
app.listen(port, function () {
    console.log('server is start on port ' + port);
});