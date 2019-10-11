
// All required environment variables should be listed here

exports.check = function() {
  let anyErrors = false
  let inner = function(envvar) {
    if (!process.env[envvar]) {
      console.error('Missing environment variable '+envvar);
      anyErrors = true
    }
  };
  [
    'TEAM_ORG', // Democracy Guardians
    'TEAM_DOMAIN', // democracyguardians.org
    'TEAM_BASE_URL', // http:democracyguardians.org
    'TEAM_UI_RELATIVE_PATH', // /team
    'TEAM_API_RELATIVE_PATH', // /team/api
    'TEAM_API_PORT', // 3001
    'TEAM_DB_HOST', // localhost
    'TEAM_DB_USER',
    'TEAM_DB_PASSWORD',
    'TEAM_DB_DATABASE',
    'TEAM_MANDRILL_API_KEY',
    'TEAM_MANDRILL_DOMAIN', // democracyguardians.org
    'TEAM_EXPRESS_SESSION_SECRET',
    'TEAM_CORS_ALLOWED_DOMAIN'
  ].forEach(function(e) {
    inner(e)
  });
  if (anyErrors) {
    process.exit(-1)
  }
}
