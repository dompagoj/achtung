const liveServer = require('live-server')

const params = {
  port: 8080, // Set the server port. Defaults to 8080.
  host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  root: '.', // Set root directory that's being served. Defaults to cwd.
  open: true, // When false, it won't load your browser by default.
  watch: 'bundle.js',
  mount: [['/components', './node_modules']], // Mount a directory to a route.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
}
liveServer.start(params)
