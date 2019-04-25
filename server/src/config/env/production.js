const {API_PORT} = process.env

// TODO  fix these two urls for prod
const API_URL = 'http://localhost:' + API_PORT
// ClientUrl is the url for this server that the client uses to make API calls
const CLIENT_URL = 'http://localhost:' + API_PORT

const TRACE_CALLS = false

module.exports = {
  isDevelop: false,
  isProduction: true,
  apiUrl: API_URL,
  clientUrl: CLIENT_URL,
  traceApiCalls: TRACE_CALLS
}
