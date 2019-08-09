
// 内部初始化
{
  Authenticator
  Authenticator: ƒ Authenticator()
  Passport: ƒ Authenticator()
  Strategy: ƒ Strategy()
  strategies: {SessionStrategy: ƒ}
  _deserializers: [ƒ]
  _framework: {initialize: ƒ, authenticate: ƒ}
  _infoTransformers: []
  _key: "passport"
  _serializers: [ƒ]
  _sm: SessionManager {_key: "passport", _serializeUser: ƒ}
  _strategies: {session: SessionStrategy, local: Strategy, google: Strategy, twitter: Strategy, linkedin: Strategy, …}
  _userProperty: "user" // use passport session
  __proto__:
    authenticate: ƒ (strategy, options, callback)
    authorize: ƒ (strategy, options, callback)
    deserializeUser: ƒ (fn, req, done) // 反序列化用户
    framework: ƒ (fw)
    init: ƒ ()
    initialize: ƒ (options)
    serializeUser: ƒ (fn, req, done)
    session: ƒ (options)
    transformAuthInfo: ƒ (fn, req, done)
    unuse: ƒ (name)
    use: ƒ (name, strategy)
    _strategy: ƒ (name)
    constructor: ƒ Authenticator()
    __proto__: Object


SessionStrategy
  name: "session"
  _deserializeUser: ƒ () // Authenticator.prototype.deserializeUser
  __proto__: Strategy
    authenticate: ƒ (req, options) // SessionStrategy.prototype.authenticate
    constructor: ƒ SessionStrategy(options, deserializeUser)
    __proto__:
      authenticate: ƒ (req, options)
      constructor: ƒ Strategy()
      __proto__: Object


SessionManager
  _key: "passport"
  _serializeUser: ƒ () // Authenticator.prototype.serializeUser
  __proto__:
    logIn: ƒ (req, user, cb)
    logOut: ƒ (req, cb)
    constructor: ƒ SessionManager(options, serializeUser)
    __proto__: Object
}

// serialize sessions && use strategy
{
  // 注册用于将用户对象序列化到会话中的函数
  [Authenticator-instance]._serializers.push(function(user, cb) {
    return cb(null, user.id);
  })
  // 注册用于从会话中反序列化用户对象的函数
  [Authenticator-instance]._deserializers.push(function(id, cb) {
    return User.load({ criteria: { _id: id }}, cb);
  })
  // use 增加策略
  [Authenticator-instance]._strategies['strategyName'] = strategy;
}
{
  LocalStrategy
  name: "local"
  _passReqToCallback: undefined
  _passwordField: "password"
  _usernameField: "email"
  _verify: ƒ (email, password, done) // 自定义function
  __proto__: Strategy
    authenticate: ƒ (req, options)
    constructor: ƒ Strategy(options, verify)
      __proto__:
      authenticate: ƒ (req, options)
      constructor: ƒ Strategy()
      __proto__: Object
}

// use passport session
{
  app.use(function initialize(req, res, next) {}) // lib/middleware/initialize.js
  app.use(function authenticate(req, res, next) {}) // lib/middleware/authenticate.js
}

// 访问页面
{
  SessionStrategy
  error: ƒ (err)
  fail: ƒ (challenge, status)
  pass: ƒ ()
  redirect: ƒ (url, status)
  success: ƒ (user, info)
  __proto__: SessionStrategy
    name: "session"
    _deserializeUser: ƒ ()
    __proto__: Strategy
      authenticate: ƒ (req, options) // SessionStrategy.prototype.authenticate
      constructor: ƒ SessionStrategy(options, deserializeUser)
      __proto__:
        authenticate: ƒ (req, options)
        constructor: ƒ Strategy()
        __proto__: Object
}

{
  LocalStrategy
  error: ƒ (err)
  fail: ƒ (challenge, status)
  pass: ƒ ()
  redirect: ƒ (url, status)
  success: ƒ (user, info)
  __proto__: Strategy
    name: "local"
    _passReqToCallback: undefined
    _passwordField: "password"
    _usernameField: "email"
    _verify: ƒ (email, password, done) // 自定义
    __proto__: Strategy
      authenticate: ƒ (req, options) // LocalStrategy.prototype.authenticate
      constructor: ƒ Strategy(options, verify)
      __proto__:
        authenticate: ƒ (req, options)
        constructor: ƒ Strategy()
        __proto__: Object
}