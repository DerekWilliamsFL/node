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

				for(var i = 0; i < titleLength; ++i) {
					var title = $('a.title')['' + i + ''].children[0].data;
					var link  = $('.first a[href]')['' + i + ''].attribs.href + "?sort=top";
					titles.push({
						'thread' : i,
						'title': title,
						'link' : link
					});
				}
				console.log(titles);
			}
			else {
				console.log("Error");
			}
		});

		prompt.get(['thread'], function (err, result) {
			
			var threadNo = result.thread;
			var url = titles[threadNo].link;
			console.log("Loading.. \n" )
			request(url, function(err, resp, body) {
				var $ = cheerio.load(body);
				//Respond with the 10 highest parent-less comments
				//console.log(url);

				//OP's message
				//var allParaElements = $('p');
				var opDiv = $('.md', '.expando')['0'].children.length;
				for (var i = 0; i < opDiv; ++i) {
					var opTypes = $('.md', '.expando')['0'].children[i].name;
					var opText  = $('.md', '.expando')['0'].children[i];
					if (opTypes == 'p') {
						console.log(opText.children[0].data);
					}
				}
				console.log('\n');

				//Maybe push usernames to an array to differentiate comments and paras? +=
				//Need to replace OPDiv with parent comments.length
				for (var n = 0; n < opDiv; ++n) {
					var commentType = $('.md p', '.commentarea')[n].name;
					var commentText = $('.md p', '.commentarea')[n].children;
					var upvotes = $('.entry .tagline .unvoted', '.commentarea')[n].children[0].data;
					if (commentType == 'p') {
						console.log(commentText[0].data + "  [" + upvotes + "]" + '\n');
					} 
					//console.log(comments)
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