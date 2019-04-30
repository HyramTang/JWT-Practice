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
  if (req.body.UserName != UserName) {
    res.json({
      state: 1,
      error: '账号错误！'
    });
  }
  if (req.body.Password != Password) {
    res.json({
      state: 1,
      error: '密码错误！'
    });
  }

  // 签发 Token
  JWTToken = JWT.sign({
    UserName: UserName
  }, JWTKEY, {
    expiresIn: 30 // 过期时间(秒)
  });
  // 设置 Cookie 存储 Token
  // 并返回 Token 到前端
  res.cookie('token', JWTToken).json({
    state: 0,
    JWTToken: JWTToken
  });
});

router.get('/logout',function(req,res,next){
  // 清空 cookie 并跳转至登录页面
  res.cookie('token','').redirect('/login');
})

// 权限页面
router.get('/page', function (req, res, next) {
  var _token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'];
  if (!_token) {
    // 没有找到 token 跳转至登录页面
    res.redirect('/login');
  }

  JWT.verify(_token, JWTKEY, function (err, decode) {
    if (err) {
      // 无效的 token 跳转至登录页面
      res.redirect('/login');
    } else {
      // token 验证成功，渲染权限管控页面
      res.render('page', {
        title: '权限管控页面',
        UserName: decode.UserName
      });
    }
  });

})

module.exports = router;