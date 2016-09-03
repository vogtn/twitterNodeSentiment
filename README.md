# twitterNodeSentiment
twitter stream for analysis of phrases
  >by: Nicolas Vogt 
  >nicolasjvogt@gmail.com
*WORK IN PROGRESS*
DEMO: 
#######coming soon

###>Inspired By:
Scott Rich's "Build a sentiment analysis application with Node.js, Express, sentiment, and ntwitter" tutorial
http://www.ibm.com/developerworks/library/wa-nodejs-app/


####The purpose of this app is to use twitter's streaming api to provide rapid Sentiment anaylsis of a phrase,  this utilizes: 

   *javascript
   
   *Nodejs
   
   *Expressjs
   
   *Twit
   
   *JSON

Much of the code in this file relies on Scott Rich's tutorial, however, ntwitter has been depreciated, therefore I adapted Twit api client instead.
I wanted this project to help teach me the twitter api ecosystem, while also providing a realistic project towards my nodejs learning. 
Currently it is still a work in progress, as of now, I am able to create a stream, and use the sentiment module to anaylze phrases. It is then logged 
console, but soon I hope to learn more front end UI (react?) to bring together the application and recieve user input. 

This function will produce sentiment analysis for keyword "jesus":
```javascript
app.get('/streamsentiment', function(req,res){
  var tweetScore = 0;
  var tweetNum = 0;
  var sentimentScore = 0;
  var stream = T.stream('statuses/filter', {track: 'jesus'})
  stream.on('tweet', function(tweet){
    if (tweet.lang === 'en') {
        sentiment(tweet.text, function (err, result) {
          tweetScore += result.score;
          tweetNum++;
          sentimentScore = tweetScore/tweetNum;
          console.log(sentimentScore);
        });
    }
  })
})
```
![ScreenShot](https://cloud.githubusercontent.com/assets/11411686/18228071/6c07f4c0-71f0-11e6-8e75-655863aa9b53.png)
