var http = require('http');

var kyotUrl = 'http://quietmusic.com/kyot-sunday-playlists';

var parseKyotUrl = function(data) {
    console.log(data);
}

http.get(kyotUrl, function (response) {
  response.setEncoding('utf8')
  response.on('data', parseKyotUrl)
  response.on('error', console.error)
});