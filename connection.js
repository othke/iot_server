/**
 * Connection module for Mongo
 */
var conf = require('./conf');
var MongoClient = require('mongodb').MongoClient

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

//the MongoDB connection
var connectionInstance;

module.exports = function() {
    return new Promise(function(resolve, reject){
        // return the singleton instance
        if(connectionInstance){
            resolve(connectionInstance);
        }
        // create the singleton instance
        else{
            MongoClient.connect(conf.MONGO_HOST, function(error, db) {
                // error with db
                if (error){
                    reject(error);
                }
                // singleton create
                else{
                    connectionInstance = db;
                    resolve(connectionInstance)
                }
            });
        }
    });
};