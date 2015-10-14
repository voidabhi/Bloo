
// Importing required packages
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
		if(fieldsArray) {
			res.send({
				status:'success',
				fields:fieldsArray
			});
		}
		else {	
			res.json({
				status:'failure',
				message:'some error occurred while making request'
			});
		}
	});
});

app.get('/places',function(req,res){
	getInternshipsPlaces(BASE_URL+'/internships',function(placesArray)
	{
		if(placesArray) {
			res.send({
				status:'success',
				places:placesArray
			});
		}
		else	{
			res.json({
				status:'failure',
				message:'some error occurred while making request'
			});
		}
	});
});

app.get('/streams',function(req,res){
	getInternshipsStreams(BASE_URL+'/internships',function(streamsArray)
	{
		if(streamsArray) {
			res.send({
				status:'success',
				streams:streamsArray
			});
		}
		else	{
			res.json({
				status:'failure',
				message:'some error occurred while making request'
			});
		}
	});
});

// Utilities

function getInternshipsFields(url,callback){
	request(url, function (error, response, body) {
		var dropdown, links, fieldsArray;
		
		if(!error&& response.statusCode == 200) {

// caching cheerio object			
			$ = cheerio.load(body,{   normalizeWhitespace: true});
			
			dropdown = $('ul.dropdown-menu').first();
		
			links  = dropdown.find('a').toArray();
			
			fieldsArray = [];
			
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

function getInternshipsPlaces(url,callback){
	
	
	request(url, function (error, response, body) {
		var links, placesArray;
		
		if(!error&& response.statusCode == 200) {
			$ = cheerio.load(body,{   normalizeWhitespace: true});
			
			links = $('a.footer-link-anchor').toArray();
			
			placesArray = [];
			
			for(var  i=0;i<9;i++)
			{
				if(links[i].attribs)
				{
					placesArray.push({
						'url':BASE_URL+links[i].attribs.href,
						'title':links[i].children[0].data
					});									
				}			
			}
			
			callback(placesArray);
		}else {
			callback(null);
		}	
	});	

}

function getInternshipsStreams(url,callback){
	var links, streamsArray;
	
	request(url, function (error, response, body) {
		
		if(!error&& response.statusCode == 200) {
			$ = cheerio.load(body,{   normalizeWhitespace: true});
			
			links = $('a.footer-link-anchor').toArray();
			
			streamsArray = [];
			
		for(var  i=9;i<18;i++)
		{
			if(links[i]&&links[i].attribs)
			{
				streamsArray.push({
					'url':BASE_URL+links[i].attribs.href,
					'title':links[i].children[0].data
				});	
			}
		}			
		
		if (streamsArray.length>0)
			callback(streamsArray);
		else
			callback(null);
		}else {
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
