var cheerio = require('cheerio');
var request = require('request');
var titles    = [];
var http    = require('http');

request('http://www.reddit.com/r/leagueoflegends', function(err, resp, body) {
	if(!err && resp.statusCode == 200) {
		var $ = cheerio.load(body);
		var titleLength = $('a.title').length;
		for(i = 0; i < titleLength; i++) {
		//$('a.title').each(function(){
			//var url = $('a.title');
			//urls.push(url);

			var title = $('a.title')['' + i + ''].children[0].data;
			//console.log(title);
			titles.push(title);
			if (title.indexOf('Megathread') !== -1) {
				console.log("There's a megathread!!")
			}

		//});
		}
		console.log(titles);
	}

	else {
		console.log("Error");
	}
});


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(titles.toString().split(',').join("\n").toString());
}).listen(3618, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3618/');