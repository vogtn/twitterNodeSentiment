var port = 3000;
var express = require('express');

var app = express();
var util = require('util');
var Twit = require("twit");

var T = new Twit({
  consumer_key: 'xQTtvg7Rz63uqPReu9vrLuPus',
  consumer_secret: 'XFEFLjfRHO0mr4x9imRbtU3JrRJeBupqHC78PnyCg3llzT6iMc',
  access_token: '717354259910496260-njBGpX5W9o5gb6seNsPh3ZV6ztWAmOW',
  access_token_secret: 'Mw3p4ovQS4XeG2hxKiBARCR9IdcwU9xOZBmBlQtEp16uO',
  timeout_ms: 60*1000,
});

app.get('/twitterCheck', function(req,res){
  T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
    res.send(data)
  })
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
