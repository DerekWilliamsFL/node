var cheerio = require('cheerio');
var request = require('request');
var titles  = [];
var sub = {};
var http    = require('http');
var prompt  = require('prompt');
/*var program = require('commander');
program.option('-1', '--first');
program.parse(process.argv);
if (program.first) console.log('First thread');*/


//Future Promise
prompt.start();

	prompt.addProperties(sub, ['subreddit'], function (err) {

		console.log('Updating..')

		request('http://www.reddit.com/r/' + sub.subreddit + '', function(err, resp, body) {
			if(!err && resp.statusCode == 200) {
				var $ = cheerio.load(body);
				var titleLength = $('a.title').length;

				for(var i = 0; i < titleLength; i++) {
					var title = $('a.title')['' + i + ''].children[0].data;
					var link  = $('.first a[href]')['' + i + ''].attribs.href;
					titles.push({
						'thread' : i,
						'title': title,
						'link' : link
					});
				}
				console.log(titles);
				//Works!
				//console.log(titles[2]);
			}
			else {
				console.log("Error");
			}
		});

		prompt.get(['thread'], function (err, result) {
			
			var threadNo = result.thread;
			var url = titles[threadNo].link;
			console.log(url)
			console.log(threadNo)
			request(url, function(err, resp, body) {
				var $ = cheerio.load(body);
				//Respond with the 10 highest parent-less comments
				//console.log(url);

				//OP's message
				var allParaElements = $('p');
				var i;
				var opDiv = $('.expando .md')['0'].children.length;
				//var opParas = $('.expando .md')['0'].children[i].type;//.data;//.type;//[0].name;
				for (i = 0; i < opDiv; i++) {
					var opTypes = $('.expando .md')['0'].children[i].name;
					var opText  = $('.expando .md')['0'].children[i].children[i][0].data;
					if (opTypes == 'p') {
					console.log(opText);
					}
				}
		
		});
	});
});

/*http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('[' + sub.subreddit + ']' + '\n' + '\n');
  res.end(titles.toString().split(',').join("\n").toString());
}).listen(3618, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3618/');*/