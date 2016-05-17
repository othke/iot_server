var recluster = require("recluster");
var path = require("path");

var cluster = recluster(path.join(__dirname, "index.js"), {
});

cluster.run();

process.on("SIGUSR2", function() {
  console.log("Signal SIGUSR2 reçu, Rechargement du cluster ...");
  cluster.reload();
});

console.log("Cluster démarré, Utilisez la commande 'kill -s SIGUSR2 " + process.pid + "' pour le recharger.");