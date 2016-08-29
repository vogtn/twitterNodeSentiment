var port = 3000;
var express = require('express');

var app = express();
var twitter = require("ntwitter");

var tweeter = new twitter({
  consumer_key: '	odiVW1DzbLhd1f8ty2ihpkJw9',
  consumer_secret: 'u4wYd5lTpMwjoaDCVNMY0d4cwUwntqsnoGwMEFuzfJ9jqjhhuU',
  access_token_key: '717354259910496260-njBGpX5W9o5gb6seNsPh3ZV6ztWAmOW',
  access_token_secret: 'Mw3p4ovQS4XeG2hxKiBARCR9IdcwU9xOZBmBlQtEp16uO'
});

app.get('/twitterCheck', function(req,res){
  tweeter.verifyCredentials(function(error,data){
    res.send("Hello, " + data.name + ". I am in your twitters");
  });
});

app.get('/',
    function (req, res) {
        var response = "<HEAD>" +
          "<title>Twitter Sentiment Analysis</title>\n" +
          "</HEAD>\n" +
          "<BODY>\n" +
          "<P>\n" +
          "Welcome to the Twitter Sentiment Analysis app.  " +
          "What phrase would you like to analzye?\n" +
          "</P>\n" +
          "<FORM action=\"/testSentiment\" method=\"get\">\n" +
          "<P>\n" +
          "Enter a phrase to evaluate: <INPUT type=\"text\" name=\"phrase\"><BR>\n" +
          "<INPUT type=\"submit\" value=\"Send\">\n" +
          "</P>\n" +
          "</FORM>\n" +
          "</BODY>";
        var phrase = req.query.phrase;
        if (!phrase) {
            res.send(response);
        } else {
            sentiment(phrase, function (err, result) {
                response = 'sentiment(' + phrase + ') === ' + result.score;
                res.send(response);
            });
        }
    });

app.listen(port);
console.log("Server listening on port" + port);
