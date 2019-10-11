
const getUserObject = require('../util/getUserObject');
const logSend = require('../util/logSend');
var logSendOK = logSend.logSendOK
var logSendSE = logSend.logSendSE

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

exports.getinbox = function(req, res, next) {
  let account = JSON.parse(JSON.stringify(req.session.user));
  getUserObject(account.email, { account }).then(userObject => {
    logSendOK(res, userObject, "getinbox success.");
  }).catch(error => {
    logSendSE(res, error, 'getinbox getUserObjectError');
  });
}
