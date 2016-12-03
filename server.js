var tweetCrawler = require('./lib/index');
var searchTerms = require('./search-terms').terms;
var settings = require('./settings');

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