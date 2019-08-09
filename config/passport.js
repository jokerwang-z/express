'use strict';

/*!
 * Module dependencies.
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');

const local = require('./passport/local');
const google = require('./passport/google');
const twitter = require('./passport/twitter');
const linkedin = require('./passport/linkedin');
const github = require('./passport/github');

/**
 * Expose
 */

 module.exports = function(passport) {
  // serialize sessions
  // 将唯一的值（如登录用户的id）序列化到session中，即sessionID，同时它将作为凭证存储在用户cookie中
  passport.serializeUser((user, cb) => {
    return cb(null, user.id);
  }); // (fn, req, done)
  // 根据存在的sessionID，从数据库中查询user并存储与req.user中
  passport.deserializeUser((id, cb) =>
    User.load({ criteria: { _id: id } }, cb)
  );

  // use these strategies, 往_strategies增加策略
  passport.use(local);
  passport.use(google);
  passport.use(twitter);
  passport.use(linkedin);
  passport.use(github);
};
