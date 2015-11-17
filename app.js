var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var ejs = require('ejs');
var mongoose = require('mongoose');
var models = require('./models/models');
var User = models.User;
var Note = models.Note;

// 生成一个 express 实例
var app = express();

// 设置视图文件存放目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置静态文件存放目录
app.use(express.static(path.join(__dirname, 'public')));

// 解析 urlencoded 请求体必备
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 使用 mongoose 连接服务
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));

// 响应首页get请求
app.get('/', function(req, res) {
    res.render('index', {
        title: '首页'
    });
});

// get 请求
app.get('/reg', function(req, res) {
    // 传递给页面需要的数据
    res.render('register', {
        title: '注册',
        // user: req.session.user,
        // page: 'reg'
    });
});


// post 请求
app.post('/reg', function(req, res) {
    // req.body 可以获取到表单的每项数据
    var username = req.body.username,
        password = req.body.password,
        passwordRepeat = req.body.passwordRepeat;

    // 检查两次输入的密码是否一致
    if(password != passwordRepeat) {
        console.log('两次输入的密码不一致！');
        return res.redirect('/reg');
    }

    // 检查用户名是否已经存在
    // findOne() 通过传递一个参数，获取与参数对应的第一条数据
    User.findOne({username:username}, function(err, user) {
        if(err) {
            console.log(err);
            return res.redirect('/reg');
        }

        if(user) {
            console.log('用户名已经存在');
            return res.redirect('/reg');
        }

        // 对密码进行md5加密
        var md5 = crypto.createHash('md5'),
            md5password = md5.update(password).digest('hex');

        // 新建user对象用于保存数据
        var newUser = new User({
            username: username,
            password: md5password
        });

        newUser.save(function(err, doc) {
            if(err) {
                console.log(err);
                return res.redirect('/reg');
            }
            console.log('注册成功！');

            // 将登录用户信息存入session中
            // 考虑到保密性，记得将密码值删除，最后直接跳转到首页
            newUser.password = null;
            delete newUser.password;
            // req.session.user = newUser;
            return res.redirect('/');
        });
    });
});

// 开始监听3000端口号
app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});