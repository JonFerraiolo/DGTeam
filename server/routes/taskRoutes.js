
const dbconnection = require('../util/dbconnection')
const latest = require('../Tasks/latest')
const gettask = require('../util/gettask');
const getUserObject = require('../util/getUserObject')
const getBaseName = require('../util/getBaseName')
const logSend = require('../util/logSend')
var logSendOK = logSend.logSendOK
var logSendCE = logSend.logSendCE
var logSendSE = logSend.logSendSE

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

var connection = dbconnection.getConnection();

exports.gettasks = function(req, res, next) {
  let account = JSON.parse(JSON.stringify(req.session.user));
  getUserObject(account.email, { account }).then(userObject => {
    logSendOK(res, userObject, "gettasks success.");
  }).catch(error => {
    logSendSE(res, error, 'gettasks getUserObjectError');
  });
}

exports.gettask = function(req, res, next) {
  let account = JSON.parse(JSON.stringify(req.session.user));
  let taskPath = req.path.substr('/gettask/'.length);
  let tokens = taskPath.split('/');
  gettask(tokens[0], tokens[1]).then(task => {
    getUserObject(account.email, { account }).then(userObject => {
      userObject.task = task;
      logSendOK(res, userObject, "gettask success.");
    }).catch(error => {
      logSendSE(res, error, 'gettask getUserObjectError');
    });
  }).catch(error => {
    logSendCE(res, 401, UNSPECIFIED_SYSTEM_ERROR, error);
  });
}

exports.updateprogress = function(req, res, next) {
  console.log('enter updateprogress');
  let userId = req.session.user && req.session.user.id;
  let account = JSON.parse(JSON.stringify(req.session.user));
  if (typeof userId !== 'number') {
    let msg = 'session userId not a number';
    logSendSE(res, msg, msg);
  } else {
    let updatedProgress = req.body;
    console.log('updatedProgress='+JSON.stringify(updatedProgress));
    let nLevels = latest.levels.length
    if (updatedProgress.version !== latest.version) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'Tasks version number '+updatedProgress.version+' is out of date', {});
    } else if (updatedProgress.level > nLevels) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid level:'+updatedProgress.level, {});
    } else if (updatedProgress.level < nLevels && !latest.levels[updatedProgress.level].tasks[updatedProgress.tasknum]) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid tasknum:'+updatedProgress.tasknum, {});
    // Special case: All level===nLevels, tasknum===step===0, which indicates completion of all tasks defined to date
    } else if (updatedProgress.level === nLevels && (updatedProgress.tasknum !== 0 || updatedProgress.step !== 0)) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid tasknum:'+updatedProgress.tasknum, {});
    } else {
      console.log('updateprogress values ok');
      let gettaskPromise = new Promise((gettaskResolve, gettaskReject) => {
        if (updatedProgress.level === nLevels) {
          // Special case: user has completed all tasks that have been defined so far
          gettaskResolve(null);
        } else {
          let taskItem = latest.levels[updatedProgress.level].tasks[updatedProgress.tasknum];
          gettask(updatedProgress.level, taskItem.name).then(task => {
            console.log('updateprogress gettask ok');
            gettaskResolve(task);
          }).catch(error => {
            gettaskReject(error);
          });
        }
      });
      gettaskPromise.then(task => {
        if (task && updatedProgress.step > task.steps.length) {
          logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid step:'+updatedProgress.step, {});
          return;
        }
        let progressPromise = new Promise((progressResolve, progressReject) => {
          console.log('updatedProgress=');
          console.dir(updatedProgress);
          connection.query('SELECT * FROM ue_ztm_progress WHERE userId = ?', [account.id], function (error, results, fields) {
            if (error) {
              progressReject("updateprogress database failure for query progress for email '" + account.email + "'");
            } else {
              if (results.length === 1) {
                let oldProgress = results[0];
                if (updatedProgress.level > oldProgress.level ||
                    (updatedProgress.level === oldProgress.level && updatedProgress.tasknum > oldProgress.tasknum) ||
                    (updatedProgress.level === oldProgress.level && updatedProgress.tasknum === oldProgress.tasknum &&
                    updatedProgress.step > oldProgress.step)) {
                  console.log('updating progress table');
                  // Need to update database
                  let now = new Date();
                  connection.query('UPDATE ue_ztm_progress SET version = ?, level = ?, tasknum = ?, step = ?, modified = ? WHERE userId = ?',
                          [latest.version, updatedProgress.level, updatedProgress.tasknum, updatedProgress.step, now, account.id],
                          function (error, results, fields) {
                    if (error) {
                      progressReject(getBaseName(__filename)+" progress update database failure for email '" + account.email + "'");
                    } else {
                      updatedProgress.version = latest.version;
                      updatedProgress.modified = now;
                      progressResolve(updatedProgress);
                    }
                  });
                } else {
                  progressResolve(updatedProgress);
                }
              } else {
                progressReject('updateprogress Error query progress error. results.length');
              }
            }
          });
        });
        progressPromise.then(progress => {
          console.log('progressPromise.then progress='+JSON.stringify(progress));
          getUserObject(account.email, {account, progress}).then(userObject => {
            logSendOK(res, userObject, "updateprogress success for email '" + account.email + "'");
          }).catch(error => {
            logSendSE(res, error, 'updateprogress getUserObjectError');
          });
        }).catch(error => {
          logSendSE(res, error, 'updateprogress progressPromise error ');
        });
      }).catch(error => {
        logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, error);
      });
    }
  }
}

exports.resetprogress = function(req, res, next) {
  console.log('enter updateprogress');
  let userId = req.session.user && req.session.user.id;
  let account = JSON.parse(JSON.stringify(req.session.user));
  if (typeof userId !== 'number') {
    let msg = 'session userId not a number';
    logSendSE(res, msg, msg);
  } else {
    let updatedProgress = req.body;
    console.log('updatedProgress='+JSON.stringify(updatedProgress));
    let nLevels = latest.levels.length
    if (updatedProgress.version !== latest.version) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'Tasks version number '+updatedProgress.version+' is out of date', {});
    } else if (updatedProgress.level > nLevels) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid level:'+updatedProgress.level, {});
    } else if (updatedProgress.level < nLevels && !latest.levels[updatedProgress.level].tasks[updatedProgress.tasknum]) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid tasknum:'+updatedProgress.tasknum, {});
    // Special case: All level===nLevels, tasknum===step===0, which indicates completion of all tasks defined to date
    } else if (updatedProgress.level === nLevels && (updatedProgress.tasknum !== 0 || updatedProgress.step !== 0)) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid tasknum:'+updatedProgress.tasknum, {});
    } else {
      let gettaskPromise = new Promise((gettaskResolve, gettaskReject) => {
        if (updatedProgress.level === nLevels) {
          // Special case: user has completed all tasks that have been defined so far
          gettaskResolve(null);
        } else {
          let taskItem = latest.levels[updatedProgress.level].tasks[updatedProgress.tasknum];
          gettask(updatedProgress.level, taskItem.name).then(task => {
            console.log('resetprogress gettask ok');
            gettaskResolve(task);
          }).catch(error => {
            gettaskReject(error);
          });
        }
      });
      gettaskPromise.then(task => {
        if (task && updatedProgress.step > task.steps.length) {
          logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid step:'+updatedProgress.step, {});
          return;
        }
        let progressPromise = new Promise((progressResolve, progressReject) => {
          let now = new Date();
          connection.query('UPDATE ue_ztm_progress SET version = ?, level = ?, tasknum = ?, step = ?, modified = ? WHERE userId = ?',
                  [latest.version, updatedProgress.level, updatedProgress.tasknum, updatedProgress.step, now, account.id],
                  function (error, results, fields) {
            if (error) {
              progressReject(getBaseName(__filename)+" progress update database failure for email '" + account.email + "'");
            } else {
              updatedProgress.version = latest.version;
              updatedProgress.modified = now;
              progressResolve(updatedProgress);
            }
          });
        });
        progressPromise.then(progress => {
          console.log('resetprogress Promise.then progress='+JSON.stringify(progress));
          getUserObject(account.email, {account, progress}).then(userObject => {
            logSendOK(res, userObject, "resetprogress success for email '" + account.email + "'");
          }).catch(error => {
            logSendSE(res, error, 'resetprogress getUserObjectError');
          });
        }).catch(error => {
          logSendSE(res, error, 'resetprogress progressPromise error ');
        });
      }).catch(error => {
        logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, error);
      });
    }
  }
}
