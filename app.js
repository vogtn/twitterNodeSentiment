var port = 3000;

var express = require('express');
var app = express();
var sentiment = require('sentiment');
var util = require('util');
var Twit = require("twit");

var stream;

var tweetCount = 0;
var tweetTotalSentiment = 0;
var monitoringPhrase;


var T = new Twit({
  consumer_key: 'xQTtvg7Rz63uqPReu9vrLuPus',
  consumer_secret: 'XFEFLjfRHO0mr4x9imRbtU3JrRJeBupqHC78PnyCg3llzT6iMc',
  access_token: '717354259910496260-njBGpX5W9o5gb6seNsPh3ZV6ztWAmOW',
  access_token_secret: 'Mw3p4ovQS4XeG2hxKiBARCR9IdcwU9xOZBmBlQtEp16uO',
  timeout_ms: 60*1000,
});


app.get('/sentiment', function (req, res) {
    res.json({monitoring: (monitoringPhrase != null),
    	monitoringPhrase: monitoringPhrase,
    	tweetCount: tweetCount,
    	tweetTotalSentiment: tweetTotalSentiment,
    	sentimentImageURL: sentimentImage()});
});

app.post('/sentiment', function (req, res) {
	try {
		if (req.body.phrase) {
	    	beginMonitoring(req.body.phrase);
			res.send(200);
		} else {
			res.status(400).send('Invalid request: send {"phrase": "bieber"}');
		}
	} catch (exception) {
		res.status(400).send('Invalid request: send {"phrase": "bieber"}');
	}
});


function resetMonitoring(){
  if (stream) {
    var tempStream = stream;
    stream = null;  // signal to event handlers to ignore end/destroy
    tempStream.destroySilent();
}
  monitoringPhrase = "";
}

function beginMonitoring(phrase) {
    // cleanup if we're re-setting the monitoring
    if (monitoringPhrase) {
        resetMonitoring();
    }
    monitoringPhrase = phrase;
    tweetCount = 0;
    tweetTotalSentiment = 0;
      T.get('account/verify_credentials', { skip_status: true })
        .catch(function (err) {
          console.log('caught error', err.stack)
        })
        .then(function (stream) {
           T.stream('statuses/filter', {
              track : monitoringPhrase
          }, function (inStream) {
            stream = inStream;
              console.log("Monitoring Twitter for " + monitoringPhrase);
              stream.on('data', function (data) {
                  //only evaluate the sentiment of English-language tweets
                  if (data.lang === 'en') {
                      sentiment(data.text, function (err, result) {
                          tweetCount++;
                          tweetTotalSentiment += result.score;
                      });
                  }
              });
              stream.on('error', function (error, code) {
                  console.error("Error received from tweet stream: " + code);
                    if (code === 420)  {
                      console.error("API limit hit, are you using your own keys?");
                    }
                    resetMonitoring();
                  });
                  stream.on('end', function (response) {
                    if (stream) { // if we're not in the middle of a reset already
                    // Handle a disconnection
                    console.error("Stream ended unexpectedly, resetting monitoring.");
                    resetMonitoring();
                  }
                });
                stream.on('destroy', function (response) {
                  // Handle a 'silent' disconnection from Twitter, no end/error event fired
                  console.error("Stream destroyed unexpectedly, resetting monitoring.");
                  resetMonitoring();
                });
          });
          return stream;
        })
    }
//Set image
function sentimentImage() {
    var avg = tweetTotalSentiment / tweetCount;
    if (avg > 0.5) { // happy
        return "/images/excited.png";
    }
    if (avg < -0.5) { // angry
        return "/images/angry.png";
    }
    // neutral
    return "/images/content.png";
}

//Search Twitter for "banana"
app.get('/twitterCheck', function(req,res){
  T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
    res.send(data.user)
  })
});

//Verify Credentials
app.get('/verifyCredentials', function (req, res) {
  T.get('account/verify_credentials', { skip_status: true })
    .catch(function (err) {
      console.log('caught error', err.stack)
    })
    .then(function (result) {
      res.send('data', result.data);
    })
});

//Stream example
app.get('/stream', function(req,res){
  var stream = T.stream('statuses/filter', { track: 'mango' })
  stream.on('tweet', function (tweet) {
    res.send(tweet);
  })
});


//Express form
app.get('/',
    function (req, res) {
        var welcomeResponse = "<HEAD>" +
        "<title>Twitter Sentiment Analysis</title>\n" +
        "</HEAD>\n" +
        "<BODY>\n" +
        "<P>\n" +
        "Welcome to the Twitter Sentiment Analysis app.<br>\n" +
        "What would you like to monitor?\n" +
        "</P>\n" +
        "<FORM action=\"/monitor\" method=\"get\">\n" +
        "<P>\n" +
        "<INPUT type=\"text\" name=\"phrase\"><br><br>\n" +
        "<INPUT type=\"submit\" value=\"Go\">\n" +
        "</P>\n" + "</FORM>\n" + "</BODY>";
        if (!monitoringPhrase) {
            res.send(welcomeResponse);
        } else {
            var monitoringResponse = "<HEAD>" +
                "<META http-equiv=\"refresh\" content=\"5; URL=http://" +
                req.headers.host +
                "/\">\n" +
                "<title>Twitter Sentiment Analysis</title>\n" +
                "</HEAD>\n" +
                "<BODY>\n" +
                "<P>\n" +
                "The Twittersphere is feeling<br>\n" +
                "<IMG align=\"middle\" src=\"" + sentimentImage() + "\"/><br>\n" +
                "about " + monitoringPhrase + ".<br><br>" +
                "Analyzed " + tweetCount + " tweets...<br>" +
                "</P>\n" +
                "<A href=\"/reset\">Monitor another phrase</A>\n" +
                "</BODY>";
            res.send(monitoringResponse);
        }
    });


//Action views

    app.get('/monitor', function (req, res) {
        beginMonitoring(req.query.phrase);
        res.redirect(302, '/');
    });
    app.get('/reset', function (req, res) {
    resetMonitoring();
    res.redirect(302, '/');
});

app.get('/watchTwitter', function (req, res) {
    var stream;
    var testTweetCount = 0;
    var phrase = 'bieber';
    // var phrase = 'ice cream';
    stream = T.stream('statuses/filter', {track: phrase}, function (stream) {
            res.send("Monitoring Twitter for \'" + phrase + "\'...  Logging Twitter traffic.");
            stream.on('data', function (data) {
                testTweetCount++;
                // Update the console every 50 analyzed tweets
                if (testTweetCount % 50 === 0) {
                    console.log("Tweet #" + testTweetCount + ":  " + data.text);
                }
            });
        });
});

app.listen(port);
console.log("Server listening on port" + port);
