Kyot Sunday Playlists
=========

A small program that extracts playlist information from http://quietmusic.com/kyot-sunday-playlists.

## Dependencies

    npm install cheerio
    npm install request
    npm install async
    npm install bunyan

## Usage

    var kyot = require('kyot-sunday-playlists')
    var shows = kyot.getShows();

## Output format

  The output of the *getShows()* method call looks something like this:

    [
      {
        "date": "December 7",
        "hours": [
          {
            "title": "Hour One",
            "songs": [
              {
                "songTitle": "Birds Flying",
                "songArtist": "Oystein Sevag"
              },
              {
                "songTitle": "On The Forest Floor",
                "songArtist": "Bob Holroyd"
              },
              {
                "songTitle": "Afternoon",
                "songArtist": "Pat Metheny Group"
              }
            ]
          },
          {
            "title": "Hour Two",
            "songs": [...]
          },
          ...
        ]
      },
      {
        "date": "November 30",
        "hours": [...]
      },
      ...
    ]

## Release History

* 0.0.1 Initial release