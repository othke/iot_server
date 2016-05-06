'use strict';
var redis_service = require('../services/redis_service');

exports.messagesPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * message (Message)
  **/
  // Get the message and call redis
  var message = args.message.value;
  // var start = Date.now();
  redis_service.requestAddMessage(message)
      .then(function(message){
        res.end();
        // var end = Date.now();
        // var delta = (end - start) / 1000;
        // console.log(delta + " secondes")
      })
      .catch(function(error){
        console.log(error);
        res.end();
      })
}

exports.messagesSynthesisGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/
  var start = Date.now();
  redis_service.synthesisMessage()
  	.then(function(response){
        res.setHeader('Content-Type', 'application/json');
  		res.end(JSON.stringify(response));
        var end = Date.now();
        var delta = (end - start) / 1000;
        console.log(delta + " secondes")
  	})
  	.catch(function(error){
  		res.end();
  	});  
}

