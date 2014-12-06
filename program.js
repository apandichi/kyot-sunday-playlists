var cheerio = require('cheerio')
var request = require('request')
var async = require('async')

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
    show.hours.splice(0, 1);
    show.hours[0].title = 'Hour One';
}

var convertPlaylistUrlToShow = function(playlistUrl, callback) {
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

var Kyot = function (callback) {
    request(kyotUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var hrefs = parseKyotUrl(body);
        async.map(hrefs, convertPlaylistUrlToShow, callback); // callback is called when all iterator functions have finished
      }
    })
};

Kyot(function (err, shows) {
    console.log(shows);
})