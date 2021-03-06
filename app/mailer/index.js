'use strict';

/**
 * Module dependencies.
 */

// 一个简单的node.js模块，用于处理所有应用程序级通知（Apple推送通知、邮件和Facebook帖子）
const Notifier = require('notifier');
const pug = require('pug');
const config = require('../../config');

/**
 * Process the templates using swig - refer to notifier#processTemplate method
 *
 * @param {String} tplPath
 * @param {Object} locals
 * @return {String}
 * @api public
 */

Notifier.prototype.processTemplate = function(tplPath, locals) {
  locals.filename = tplPath;
  return pug.renderFile(tplPath, locals);
};

/**
 * Expose
 */

module.exports = {
  /**
   * Comment notification
   *
   * @param {Object} options
   * @param {Function} cb
   * @api public
   */

  comment: function(options, cb) {
    const article = options.article;
    const author = article.user;
    const user = options.currentUser;
    const notifier = new Notifier(config.notifier);
    console.log('90')
    const obj = {
      to: author.email,
      // from: 'your@product.com',
      from: '1506525912@qq.com',
      subject: user.name + ' added a comment on your article ' + article.title,
      alert: user.name + ' says: "' + options.comment,
      locals: {
        to: author.name,
        from: user.name,
        body: options.comment,
        article: article.name
      }
    };

    // for apple push notifications
    /*notifier.use({
      APN: true
      parseChannels: ['USER_' + author._id.toString()]
    })*/

    try {
      notifier.send('comment', obj, cb);
    } catch (err) {
      console.log(err);
    }
  }
};
