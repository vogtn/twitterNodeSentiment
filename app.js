var port = (3000);
var express = require('express');

var app = express();

app.get('/', function(req,res){
  var response = "<HEAD>" +
  "<title>Twitter Sentiment Analysis"</title>
});

app.listen(port);
console.log("Server listening on port" + port);
