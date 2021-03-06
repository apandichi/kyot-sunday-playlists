var cheerio = require('cheerio')
var request = require('request')
var async = require('async')
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'kyot-sunday-playlists'});

var kyotUrl = 'http://quietmusic.com/kyot-sunday-playlists';

var parseKyotUrl = function(data) {
    log.info('Parsing kyot URL response');
    $ = cheerio.load(data);
    var hrefs = $(".entry-content").find("p").find("a")
        .map(function(index, elem){
            return $(elem).attr('href');
        }).get();
    log.info('Done parsing kyot URL response. Hrefs: ' + hrefs);
    return hrefs;
}

var parsePlaylistPage = function(data) {
    $ = cheerio.load(data);
    var date = $(".entry-title").text();
    var hours = $(".entry-content").find("p") //.find("b")
        .map(function(index, elem) {
            var title = $(elem).find('b').text();
            var hourText = $(elem).text().split('\n');
            hourText.splice(0, 1); // remove first element, which is the hour title
            var songs = hourText.map(function (elem, index) {
                var song = elem.split('/');
                return {
                    songTitle: song[1].trim(),
                    songArtist: song[2].trim()
                }
            });
            return {
                title: title,
                songs: songs
            };
        }).get();

    return {
        date: date,
        hours: hours
    };
}

var fixGlitch = function(show) {
    log.info('Fixing glitch for show: ' + JSON.stringify(show));
    show.hours.splice(0, 1);
    show.hours[0].title = 'Hour One';
}

var convertPlaylistUrlToShow = function(playlistUrl, callback) {
   log.info('Converting playlist URL to show: ' + playlistUrl);
   request(playlistUrl, function (error, response, body) {
       if (!error && response.statusCode == 200) {
           var show = parsePlaylistPage(body);
           if (show.date === 'October 26') {
               fixGlitch(show);
           }
           callback(null, show) // null stands for error
       }
   });
}

var getShows = function (callback) {
    log.info('Making HTTP request to ' + kyotUrl);
    request(kyotUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var hrefs = parseKyotUrl(body);
        async.map(hrefs, convertPlaylistUrlToShow, callback); // callback is called when all iterator functions have finished
      }
    })
};

module.exports = {
    getShows: getShows
}