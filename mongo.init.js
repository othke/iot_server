use hackathon
db.runCommand( { create: "messages"} );
db.messages.createIndex({ id: 1 }, {unique:true});
db.messages.dropIndex("_id_");