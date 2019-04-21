
const API_PORT = process.env.API_PORT

// TODO  fix these two urls for prod
const API_URL = 'http://localhost:' + API_PORT
// clientUrl is the url for this server that the client uses to make API calls
const CLIENT_URL = 'http://localhost:' + API_PORT

const TRACE_CALLS = true


module.exports = {
  isDevelop: true,
  isProduction: false,
  apiUrl: API_URL,
  clientUrl: CLIENT_URL,
  traceApiCalls: TRACE_CALLS
}
