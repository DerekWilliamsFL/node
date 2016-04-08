var cheerio = require('cheerio');
var request = require('request');
var titles  = [];
var sub = {};
var http    = require('http');
var prompt  = require('prompt');

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
					var link  = $('.first a[href]')['' + i + ''].attribs.href + '?sort=top';
					var score = $('.midcol .unvoted')[ '' + i + ''].children[0].data;
					var comments = $('.first a')['' + i + ''].children[0].data;
					titles.push({
						'thread' : i,
						'title': title,
						'link' : link,
						'score' : score
					});
					console.log("-> " + i + " | " + score + " points:\n" + title + " | " + comments + "\n----------");
				}
				
			}
			else {
				console.log("Error");
			}
		function getThread () {
			//if($('#noresults')){console.log('No Threads in this sub'); return }
			prompt.get(['thread'], function (err, result) {
				var threadNo = result.thread;
				var url = titles[threadNo].link;
				console.log("Loading.. \n" )
				request(url, function(err, resp, body) {
					var $ = cheerio.load(body);
					
					var opDiv = $('.md', '.expando')['0'].children.length;
					for (var i = 0; i < opDiv ; ++i) {
						var opTypes = $('.md', '.expando')['0'].children[i].name;
						var opText  = $('.md', '.expando')['0'].children[i];
						if (opTypes == 'p') {
							console.log(opText.children[0].data);
						}
					}
					console.log("-------------------\n")
					if(opDiv == null){
						var opLink = $('p.title a[href]')[0].attribs.href;
						console.log("OP had no text\n");
						console.log(opLink);
					}

					var commentLen = 10;

					for (var n = 0; n < 10; ++n) {

						var commentType = $('.md').children('p')[n];
						if(commentType.name != null) {
							var commentText = $('.md p', '.commentarea')[n].children;
							var upvotes = $('.entry .tagline .unvoted', '.commentarea')[n].children[0].data;
							var noncollapsed = $('.md p', '.commentarea')[n].children[0].data;
							
							if (commentType.name == 'p') {
								console.log(noncollapsed + " [ " + upvotes + " ]" + '\n'); 
							} 
						}
						else if (commentType == null ) {
								console.log("No comments yet.");
						}
						else if (commentType == undefined) {
							console.log("No more comments");
						}
					}
				});
			});
		};
		getThread();
	});
});