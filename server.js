'use strict';

/**
 * Module dependencies
 */
// 环境变量从.env文件加载到process.env中
require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport'); // 身份验证中间件
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;
const app = express();

/**
 * Expose
 */

module.exports = app;

// 引导
// Bootstrap models (~位运算符非: 取反-1, ~1=-2), models文件夹下的所有js文件.
fs.readdirSync(models)
.filter(file => ~file.search(/^[^.].*\.js$/)) // 返回~0=-1, ~-1=0 => true, false
.forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

connect();

function listen() {
  if (app.get('env') === 'test') return;
  app.listen(port);
  console.log('Express app started on port ' + port);
}

console.log('运行环境：', process.env.NODE_ENV);

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(config.db, { keepAlive: 1, useNewUrlParser: true });
}
