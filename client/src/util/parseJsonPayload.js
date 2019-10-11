
/**
 * Utility to parse and process a json payload returned by a server api call.
 * @param {object} res  response object returned by fetch
 * @param {string} debugId  string to put at start of debug or log messages
 * @param {function} successCB  function to call if json parse succeeds
 */
let processJsonPayload = ((res, debugId, successCB) => {
  const contentType = res.headers.get('Content-Type');
  if (contentType && ~contentType.indexOf('json')) {
    return res.json().then((json) => {
      successCB(json)
    }).catch((error)  => {
      console.error(debugId+' json() error='+error)
      this.props.history.push('/systemerror')
    })
  } else {
    console.error(debugId+' contentType not parseable json')
    this.props.history.push('/systemerror')
  }
})

export default processJsonPayload
