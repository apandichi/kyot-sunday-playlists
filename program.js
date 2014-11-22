var http = require('http');

var kyotUrl = 'http://quietmusic.com/kyot-sunday-playlists';

http.get(kyotUrl, function (response) {
  response.setEncoding('utf8')
  response.on('data', console.log)
  response.on('error', console.error)
});