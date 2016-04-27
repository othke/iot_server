'use strict';

exports.messagesPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * message (Message)
  **/
  // no response value expected for this operation
  
  
  res.end();
}

exports.messagesSynthesisGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/
  
  
  var examples = {};
  examples['application/json'] = [ {
  "minValue" : 123456789,
  "maxValue" : 123456789,
  "sensorType" : 123,
  "mediumValue" : 123456789
} ];
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

