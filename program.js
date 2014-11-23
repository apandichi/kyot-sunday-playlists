var cheerio = require('cheerio')
var request = require('request')

var kyotUrl = 'http://quietmusic.com/kyot-sunday-playlists';

var parseKyotUrl = function(data) {
    $ = cheerio.load(data);
    var hrefs = $(".entry-content").find("p").find("a")
        .map(function(index, elem){
            return $(elem).attr('href');
        }).get();
    return hrefs;
}

var parsePlaylistPage = function(data) {
    $ = cheerio.load(data);
    var hours = $(".entry-content").find("p").find("b")
        .map(function(index, elem){
            return $(elem).text();
        }).get();
    return hours;
}

request(kyotUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var hrefs = parseKyotUrl(body);
    hrefs.forEach(function(playlistUrl) {
        request(playlistUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var hours = parsePlaylistPage(body);
                console.log(hours)
            }
        })
    })
  }
})