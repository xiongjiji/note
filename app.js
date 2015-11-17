var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var ejs = require('ejs')

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

// 响应首页get请求
app.get('/', function(req, res) {
    res.render('index', {
        title: '首页'
    });
});

// 开始监听3000端口号
app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});