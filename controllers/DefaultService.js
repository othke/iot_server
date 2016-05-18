'use strict';
var mongo_service = require('../services/mongo_service');


exports.messagesPOST = function(args, res, next) {
    /**
     * parameters expected in the args:
     * message (Message)
     **/
    
    // Get the message and call redis
    var message = args.message.value;
    mongo_service.requestAddMessage(message)
        .then(function(message){
            res.end();
        })
        .catch(function(error){
            // console.log(error);
            res.statusCode = 500;
            res.end()
        })
}

exports.messagesSynthesisGET = function(args, res, next) {
    /**
     * parameters expected in the args:
     **/
	mongo_service.getSynthesis()
	.then(function(result){
		res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
		res.end(result);
	})
    .catch(function(error){
        //console.log(error);
        res.statusCode = 500;
        res.end()
    })
}   

