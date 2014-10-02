
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

var BASE_URL = 'http://www.internshala.com';

// Configuration

app.configure(function (){
  app.set('port', process.env.PORT || 8888);
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
});

// Endpoints

app.get('/', function (req, res) {
  res.redirect('https://github.com/voidabhi/Bloo');
});

app.get('/fields',function(req,res){
	getInternshipsFields(BASE_URL+'/internships',function(fieldsArray)
	{
		if(fieldsArray)
			res.send({
				status:'success',
				fields:fieldsArray
			});
		else	
			res.json({
				status:'failure',
				message:'some error occurred while making request'
			});			
	});
});

// Utilities

function getInternshipsFields(url,callback){
	request(url, function (error, response, body) {
		
		if(!error&& response.statusCode == 200) {
			$ = cheerio.load(body,{   normalizeWhitespace: true});
			
			var dropdown = $('ul.dropdown-menu').first();
			
			var links  = dropdown.find('a').toArray();
			
			var fieldsArray = [];
			
			for(var link in links)
			{
				fieldsArray.push({
					'url':BASE_URL+links[link].attribs.href,
					'title':links[link].children[0].data
				});
			}
			
			callback(fieldsArray);
		}
		else {
			callback(null);
		}
	});	

}

// Starting App

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8888;
app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
