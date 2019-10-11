
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var TEAM_EXPRESS_SESSION_SECRET = process.env.TEAM_EXPRESS_SESSION_SECRET

module.exports = {
  init: function(app, connection) {

    var options = {};
    var sessionStore = new MySQLStore(options, connection);

    app.use(session({
        cookie: { secure: false , maxAge:24*60*60*10000  }, // secure:true once https
        proxy: true,
        secret: TEAM_EXPRESS_SESSION_SECRET,
        store: sessionStore,
        resave: true,
        rolling: true,
        saveUninitialized: false
    }));
  },

  // Authentication and Authorization Middleware
  auth: function(req, res, next) {
    console.log('auth typeof req='+typeof req);
    console.log('auth typeof req.session='+typeof req.session);
    console.log('req.session.id='+req.session.id);
    console.log('auth typeof req.session.user='+typeof req.session.user);
    if (req.session && req.session.user)
      return next();
    else
      return res.sendStatus(401);
  }

}
