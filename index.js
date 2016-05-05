'use strict';

// Swagger app
var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');
var serverPort = 8080;

// Set Redis conf
var conf = require('./conf');
process.env.REDIS_HOST = conf.REDIS_HOST;
process.env.REDIS_PORT = conf.REDIS_PORT;

// swaggerRouter configuration
var options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};


// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());


  // Start Redis instance
  var redis_connection = require('./connection');
  redis_connection.on('error', function(err){
    console.log('cannot start redis with: ' + conf.REDIS_HOST + ":" + conf.REDIS_PORT);
    process.exit();
  })

  redis_connection.on('ready', function(){
    console.log('start redis with: ' + conf.REDIS_HOST + ":" + conf.REDIS_PORT);
      // Start the server
      http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
      });
  })
  
});
