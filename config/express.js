'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const session = require('express-session'); // express-session是针对nodejs express框架提供的一套session扩展
const compression = require('compression'); // Gzip压缩功能
const handleLog = require('./log/handleLog');

const cookieParser = require('cookie-parser'); // cookie-parser中间件用来对cookie进行解析，主要包括普通cookie的解析和签名cookie的解析
const bodyParser = require('body-parser'); // 对post请求的请求体进行解析
const methodOverride = require('method-override'); // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

// CSRF（Cross-site request forgery），中文名称：跨站请求伪造;
const csrf = require('csurf'); // 创建用于创建和验证CSRF令牌的中间件
const cors = require('cors');
const helmet = require('helmet'); // 保护Express应用程序,设置HTTP响应头
const upload = require('multer')(); // Multer is a node.js middleware for handling multipart/form-data

const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash'); // 闪存消息存储在会话中, 依赖session

const helpers = require('view-helpers'); // 界面视图，例如渲染mobile页面
const ultimatePagination = require('ultimate-pagination'); // 通用分页模型生成算法，可用于为任何基于javascript的平台/框架构建UI组件
const requireHttps = require('./middlewares/require-https');
const config = require('./');
const pkg = require('../package.json');

const env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = function(app, passport) {
  app.use(helmet());
  app.use(requireHttps);

  // Compression middleware (should be placed before express.static)
  app.use(
    compression({
      // 字节数，阈值
      threshold: 512
    })
  );

  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://reboil-demo.herokuapp.com'],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true // Access-Control-Allow-Credentials
    })
  );

  // Static files middleware
  app.use(express.static(config.root + '/public'));


  // Don't log during tests
  // Logging middleware
  if (env !== 'test') {
    app.use(handleLog);
  }

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  // expose package.json to views
  app.use(function(req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });

  // bodyParser should be above methodOverride
  app.use(bodyParser.json()); // {body}
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(upload.single('image'));
  app.use(
    // {originalMethod}
    methodOverride(function(req) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
  );

  // CookieParser should be above session
  app.use(cookieParser()); // {"secret", "cookies", "signedCookies"}
  // {"sessionStore", "sessionID", "session"}
  app.use(
    session({
      cookie: {
        expires: 1000 * 60 * 60, // 1 hours
        httpOnly: true,
      },
      name: 'sessionid',
      resave: true, // resave是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
      saveUninitialized: true, // 是否强制将“未初始化”的会话保存到存储区
      secret: pkg.name, // 签署会话ID cookie的秘密 (required)
      // 会话存储的实例，默认为一个MemoryStore的实例, 负载均衡配置 Session，把 Session 保存到数据库里面（session入库）
      store: new mongoStore({
        url: config.db,
        collection: 'sessions'
      })
    })
  );
  // use passport session
  app.use(passport.initialize()); // {_passport}
  app.use(passport.session()); // {user}

  // connect flash for flash messages - should be declared after sessions
  app.use(flash()); // {flash}

  // should be declared after session and flash
  app.use(helpers(pkg.name)); // {isMobile}

  if (env !== 'test') {
    app.use(csrf()); // {"csrfToken"}

    // This could be moved to view-helpers :-)
    app.use(function(req, res, next) {
      res.locals.csrf_token = req.csrfToken();
      res.locals.paginate = ultimatePagination.getPaginationModel;
      next();
    });
  }

  if (env === 'development') {
    app.locals.pretty = true;
  }
};
