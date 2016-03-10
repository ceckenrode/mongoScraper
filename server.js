var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var handlebars = require('express-handlebars');

//Database configuration
var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

app.get('/scrape', function(req, res) {
  request("https://en.wikipedia.org/wiki/Batman", function(err, response, html) {
    var $ = cheerio.load(html);
    var result = [];

    $('.mw-headline').each(function(index, el) {
      console.log($(this).text());
      var text = $(this).text();
      result.push(text);
    });

    db.scrapedData.insert({data: result});
  })
});


app.get('/illegal', function(req, res) {
  var result = db.scrapedData.find();
  res.json(result);
});



app.listen(3000, function() {
  console.log('App running on port 3000!');
});
