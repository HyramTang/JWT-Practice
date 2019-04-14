var express = require('express');
var router = express.Router();
// JWT
const JWT = require('jsonwebtoken');
const JWTKEY = '123';
var JWTToken = '';

// 定义账号密码
var UserName = 'Hyram';
var Password = '123';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: ' 首页'
  });
});

// 登录页面
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: '登录'
  })
});

// 登录表单
router.post('/login', function (req, res, next) {
  if (req.body.UserName == UserName && req.body.Password == Password) {
    JWTToken = JWT.sign({
      UserName: UserName
    }, JWTKEY, {
      expiresIn: 300
    });
    res.redirect('/page?token=' + JWTToken);
    // res.send('Hello' + JWTToken);
  } else {
    res.render('login', {
      title: '登录',
      error: '账号密码错误！'
    });
  }
});

// 权限页面
router.get('/page', function (req, res, next) {
  var _token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (_token) {
    JWT.verify(_token, JWTKEY, function (err, decode) {
      if (err) {
        res.json({
          success: false,
          message: '无效的token.'
        });
      } else {
        res.render('page', {
          title: '授权页面',
          UserName: decode.UserName
        });
      }
    });
  } else {
    res.status(403).send({
      success: false,
      message: '没有找到token.'
    });
  }
})

module.exports = router;