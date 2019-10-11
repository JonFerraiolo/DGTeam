
const dbconnection = require('../util/dbconnection')
const latest = require('../Tasks/latest')
const profileCategories = require('../util/profileCategories');
const getUserObject = require('../util/getUserObject')
const logSend = require('../util/logSend')
var logSendOK = logSend.logSendOK
var logSendCE = logSend.logSendCE
var logSendSE = logSend.logSendSE

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

var connection = dbconnection.getConnection();

//FIXME need org logic too
let personCategories = profileCategories.person.map(catPersonObj => catPersonObj.category);

/**
  Returns the profile data for a particular subject for a particular profile category
  Removes existing data for subject/category then adds rows for the supplied data.
  If category===vital, returns:
  categoryData={ subjectId:{number}
            category:{string}
            legalName:{string}, dob:{string}, otherVital:{string}}
  Else If category===name, returns:
  categoryData={ subjectId:{number}
            category:{string}
            legalName:{string}
            values:[{string}]}
  Else, returns:
  categoryData={ subjectId:{number}
            category:{string}
            values:[{string}]}
*/
exports.getprofilecategorydata = function(req, res, next) {
  console.log('enter getprofilecategorydata');
  let userId = req.session.user && req.session.user.id;
  let account = JSON.parse(JSON.stringify(req.session.user));
  if (typeof userId !== 'number') {
    let msg = 'session userId not a number';
    logSendSE(res, msg, msg);
    return;
  }
  let payload = req.body;
  console.log('payload='+JSON.stringify(payload));
  let { subjectId, category } = payload;
  if (personCategories.indexOf(category) < 0) {
    logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'getprofilecategorydata invalid category: '+category);
    return;
  }
  let checkSubjectIdPromise = new Promise((checkSubjectIdResolve, checkSubjectIdReject) => {
    connection.query('SELECT * FROM ue_ztm_account WHERE id = ?', [subjectId], function (error, results, fields) {
      if (error) {
        checkSubjectIdReject("getprofilecategorydata database failure for query subjectId '"+subjectId+
            "' submitted by email '" + account.email + "'");
      } else {
        if (results.length !== 1) {
          checkSubjectIdReject("getprofilecategorydata subjectId '"+subjectId+"' not found, submitted by email '" + account.email + "'");
        } else {
          checkSubjectIdResolve();
        }
      }
    });
  });
  checkSubjectIdPromise.then(() => {
    let sql, database
    if (category === 'vital') {
      sql = 'SELECT * FROM ue_ztm_profile_item WHERE subjectId = ? AND (category = "legalName" OR category = "dob" OR category = "otherVital")';
      data = [subjectId];
    } else if (category === 'name') {
      sql = 'SELECT * FROM ue_ztm_profile_item WHERE subjectId = ? AND (category = "name" OR category = "legalName")';
      data = [subjectId];
    } else {
      sql = 'SELECT * FROM ue_ztm_profile_item WHERE subjectId = ? AND category = ?';
      data = [subjectId, category];
    }
    connection.query(sql, data, function (error, results, fields) {
      if (error) {
        logSendSE(res, error, "getprofilecategorydata database failure for query subjectId '"+subjectId+
            "' submitted by email '" + account.email + "'");
      } else {
        console.log('getprofilecategorydata results='+JSON.stringify(results));
        getUserObject(account.email, { account }).then(userObject => {
          userObject.categoryData = { subjectId, category };
          if (category === 'vital') {
            results.forEach(row => {
              userObject.categoryData[row.category] = row.value;
            });
          } else if (category === 'name') {
            let legalNameIndex = results.findIndex(row => (row.category === 'legalName'));
            if (legalNameIndex >= 0) {
              userObject.categoryData.legalName = results[legalNameIndex].value;
              results.splice(legalNameIndex, 1);
            }
            userObject.categoryData.values = results.map(item => item.value)
          } else {
            userObject.categoryData.values = results.map(item => item.value)
          }
          logSendOK(res, userObject, "getprofilecategorydata success.");
        }).catch(error => {
          logSendSE(res, error, 'getprofilecategorydata getUserObjectError');
        });
      }
    });
  }).catch(error => {
    logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, error);
  });
};

/**
  Sets the profile data for a particular subject for a particular profile category
  Removes existing data for subject/category then adds rows for the supplied data.
  If category===vital:
  categoryData={ subjectId:{number}
            category:{string}
            legalName:{string}, dob:{string}, otherVital:{string}}
  Else:
  req.body={ subjectId:{number}
            category:{string} ENUM from profileCategories, with exclusions
            values:[{string}]}
*/
exports.setprofilecategorydata = function(req, res, next) {
  console.log('enter setprofilecategorydata');
  let userId = req.session.user && req.session.user.id;
  let account = JSON.parse(JSON.stringify(req.session.user));
  if (typeof userId !== 'number') {
    let msg = 'session userId not a number';
    logSendSE(res, msg, msg);
    return;
  }
  let payload = req.body;
  console.log('payload='+JSON.stringify(payload));
  let { subjectId, category, values } = payload;
  if (personCategories.indexOf(category) < 0) {
    logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'setprofilecategorydata invalid category: '+category);
    return;
  }
  if (category !== 'vital' && !Array.isArray(values)) {
    logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'setprofilecategorydata invalid value for "values": '+values);
    return;
  }
  let now = new Date();
  let rows
  if (category === 'vital') {
    rows = [];
    ['legalName','dob','otherVital'].forEach(cat => {
      if (payload[cat]) {
        rows.push([ subjectId, cat, 0, payload[cat], now ])
      }
    });
  } else {
    rows = values.map((value, index) => [ subjectId, category, index, value, now ]);
  }
  console.log('rows='+JSON.stringify(rows));
  let checkSubjectIdPromise = new Promise((checkSubjectIdResolve, checkSubjectIdReject) => {
    connection.query('SELECT * FROM ue_ztm_account WHERE id = ?', [subjectId], function (error, results, fields) {
      if (error) {
        checkSubjectIdReject("setprofilecategorydata database failure for query subjectId '"+subjectId+
            "' submitted by email '" + account.email + "'");
      } else {
        if (results.length !== 1) {
          checkSubjectIdReject("setprofilecategorydata subjectId '"+subjectId+"' not found, submitted by email '" + account.email + "'");
        } else {
          checkSubjectIdResolve();
        }
      }
    });
  });
  checkSubjectIdPromise.then(() => {
    let deletePromise = new Promise((deleteResolve, deleteReject) => {
      let sql, data
      if (category === 'vital') {
        sql = 'DELETE FROM ue_ztm_profile_item WHERE subjectId = ? AND (category = "legalName" OR category = "dob" OR category = "otherVital")';
        data = [subjectId];
      } else {
        sql = 'DELETE FROM ue_ztm_profile_item WHERE subjectId = ? AND category = ?';
        data = [subjectId, category];
      }
      connection.query(sql, data, function (error, results, fields) {
        if (error) {
          deleteReject("setprofilecategorydata database failure for query subjectId '"+subjectId+
              "' submitted by email '" + account.email + "'");
        } else {
          deleteResolve();
        }
      });
    });
    deletePromise.then(() => {
      if (rows.length === 0) {
        getUserObject(account.email, {account}).then(userObject => {
          logSendOK(res, userObject, "setprofilecategorydata success for subjectId '"+subjectId+
              "' submitted by email '" + account.email + "'");
        }).catch(error => {
          logSendSE(res, error, 'setprofilecategorydata getUserObjectError');
        });
        return;
      }
      let sql = 'INSERT INTO ue_ztm_profile_item (subjectId, category, valueIndex, value, modified) VALUES ?';
      connection.query(sql, [rows], function (error, results, fields) {
        if (error) {
          logSendSE(res, error, "setprofilecategorydata database insert failure for subjectId '"+subjectId+
              "' submitted by email '" + account.email + "'");
        } else {
          getUserObject(account.email, {account}).then(userObject => {
            logSendOK(res, userObject, "setprofilecategorydata insert success for subjectId '"+subjectId+
                "' submitted by email '" + account.email + "'");
          }).catch(error => {
            logSendSE(res, error, 'setprofilecategorydata getUserObjectError');
          });
        }
      });
    }).catch(error => {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, error);
    });
  }).catch(error => {
    logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, error);
  });
};
