/*
 * @package tweet-crawler
 * @copyright Copyright(c) 2016 Paranoia Watch
 * @author Boris van Hoytema <boris AT newatoms DOT com>
 * @author Wouter Vroege <wouter AT woutervroege DOT nl>
 */

var tracker = require('./tracker');
var parseTweet = require('./tweet-parser');
var events = require('events');

var TweetCrawler;
var store = require('./store');
var Store;

function main(settings) {

  TweetCrawler = _init(settings);
  TweetCrawler.trackPublicationStream = _trackPublicationStream;
  TweetCrawler.savePublication = _savePublication;
  TweetCrawler.dbconnect = _dbconnect;

  Store.on('publication-save-error', function(error) {
    TweetCrawler.emit('publication-save-error', error)
  })

  Store.on('publication-saved', function() {
    TweetCrawler.emit('publication-saved')
  })

  Store.on('connected', function() {
    TweetCrawler.emit('store-connected')
  })

  Store.on('disconnected', function() {
    TweetCrawler.emit('store-disconnected')
  })

  Store.on('reconnected', function() {
    TweetCrawler.emit('store-reconnected')
  })

  Store.on('connection-error', function(error) {
    TweetCrawler.emit('store-connection-error', error)
  })

  return TweetCrawler;
}

function _init (settings) {
  var instance = new events.EventEmitter();
  Store = new store(settings.dburi);
  instance.consumerKey = settings.consumerKey;
  instance.consumerSecret = settings.consumerSecret;
  instance.accessToken = settings.accessToken;
  instance.accessSecret = settings.accessSecret;
  return instance;
} 

function _trackPublicationStream (termsArray) {
  var publicationStream = new tracker({
    terms: termsArray,
    consumerKey: TweetCrawler.consumerKey,
    consumerSecret: TweetCrawler.consumerSecret,
    accessToken: TweetCrawler.accessToken,
    accessSecret: TweetCrawler.accessSecret
  })

  publicationStream.on('connect', function(statusMessage) {
    TweetCrawler.emit('connect', statusMessage)
  })

  publicationStream.on('connection-error', function(error) {
    TweetCrawler.emit('connection-error', error)
  })

  publicationStream.on('tweet', function(tweet) {
    var publication = parseTweet(tweet)
    if (publication) TweetCrawler.emit('publication', publication)
  })

}

function _dbconnect() {
  return Store.connect();
}

function _savePublication (publication) {
  Store.savePublication(publication);
}

module.exports = main;