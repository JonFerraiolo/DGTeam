
var envvars = require('./util/envvars');
envvars.check(); // exits if any env vars not set

var express = require("express");
var bodyParser = require('body-parser');
var dbconnection = require('./util/dbconnection');
var sessionMgmt = require('./util/sessionMgmt');
var sessionRoutes = require('./routes/sessionRoutes');
var inboxRoutes = require('./routes/inboxRoutes');
var taskRoutes = require('./routes/taskRoutes');
var profileRoutes = require('./routes/profileRoutes');

var TEAM_API_RELATIVE_PATH = process.env.TEAM_API_RELATIVE_PATH;
var TEAM_API_PORT = process.env.TEAM_API_PORT;
var TEAM_CORS_ALLOWED_DOMAIN = process.env.TEAM_CORS_ALLOWED_DOMAIN;

var connection = dbconnection.getConnection();

var app = express();
app.use(function(req, res, next) {
  console.log('req.path='+req.path)
  next()
});
var authMiddleware = sessionMgmt.auth;
sessionMgmt.init(app, connection); // calls app.use with session middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", TEAM_CORS_ALLOWED_DOMAIN);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookie");
  next();
});

var apiRouter = express.Router();
apiRouter.post('/signup', sessionRoutes.signup)
apiRouter.post('/login', sessionRoutes.login)
apiRouter.post('/logout', sessionRoutes.logout)
apiRouter.post('/loginexists', sessionRoutes.loginexists)
apiRouter.post('/resendverification', sessionRoutes.resendVerificationEmail)
apiRouter.get('/verifyaccount/:token', sessionRoutes.verifyAccount)
apiRouter.post('/sendresetpassword', sessionRoutes.sendResetPasswordEmail)
apiRouter.get('/gotoresetpasswordpage/:token', sessionRoutes.gotoResetPasswordPage)
apiRouter.post('/resetpassword', sessionRoutes.resetPassword)

apiRouter.post('/getinbox', authMiddleware, inboxRoutes.getinbox)
apiRouter.post('/gettask/:level/:name', authMiddleware, taskRoutes.gettask)
apiRouter.post('/gettasks', authMiddleware, taskRoutes.gettasks)
apiRouter.post('/updateprogress', authMiddleware, taskRoutes.updateprogress)
apiRouter.post('/resetprogress', authMiddleware, taskRoutes.resetprogress)
apiRouter.post('/getprofilecategorydata', authMiddleware, profileRoutes.getprofilecategorydata)
apiRouter.post('/setprofilecategorydata', authMiddleware, profileRoutes.setprofilecategorydata)
app.use(TEAM_API_RELATIVE_PATH, apiRouter);

app.listen(TEAM_API_PORT);
