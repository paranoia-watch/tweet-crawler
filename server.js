require('dotenv').config({silent: true})
var tweetCrawler = require('./lib/index');
var searchTerms = require('./search-terms').terms;

var settings = {
  "dburi": process.env.DBURI,
  "consumerKey": process.env.CONSUMER_KEY,
  "consumerSecret": process.env.CONSUMER_SECRET,
  "accessToken": process.env.ACCESS_TOKEN,
  "accessSecret": process.env.ACCESS_SECRET
}

var TweetCrawler = new tweetCrawler(settings);

TweetCrawler.on('connect', function() {
  console.info('TweetCrawler Connected')
})

TweetCrawler.on('connection-error', function(connectionError) {
  console.error('TweetCrawler Failed to connect', connectionError)
})

TweetCrawler.on('publication', function(publication) {
  TweetCrawler.savePublication(publication);
})

TweetCrawler.on('publication-save-error', function(error) {
  console.error('publication not saved', error);
})

TweetCrawler.on('publication-saved', function() {
  console.info('publication saved');
})

TweetCrawler.on('store-connected', function() {
  console.info('store connected');
})

TweetCrawler.on('store-reconnected', function() {
  console.info('store reconnected');
})

TweetCrawler.on('store-connection-error', function(error) {
  console.warn('store connection error', error);
})

TweetCrawler.on('store-disconnected', function() {
  console.warn('store disconnected');
})

TweetCrawler.dbconnect();
TweetCrawler.trackPublicationStream(searchTerms)