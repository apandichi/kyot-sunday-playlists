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

request(kyotUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var hrefs = parseKyotUrl(body);
    console.log(hrefs)
  }
})