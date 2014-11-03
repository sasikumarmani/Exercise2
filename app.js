var cluster = require('cluster');
var https = require('https');
var fs = require('fs');
var numCPUs = require('os').cpus().length;
var domain = require('domain');
var express = require('express');
var app = express();
var formidable = require('formidable');
var winston = require('winston');
app.set('view engine', 'ejs');

var logger = new (winston.Logger)({  
    transports: [
        new (winston.transports.Console)({ level: 'info' }),
        new (winston.transports.File)({ filename: __dirname + 'reggie_node.log', level: 'info' })
    ]
});

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='image'/>" +
"<input type='submit' /></form>" +
"</body></html>";


 var options = {
  key: fs.readFileSync('19875079-localhost_3000.key'),
  cert:fs.readFileSync('19875079-localhost_3000.cert')
};

if (cluster.isMaster) {

	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('disconnect', function(worker) {
		console.error('disconnect!');
		cluster.fork();
    });
}else{	

    var httpsServer = https.createServer(options, app);
	
	httpsServer.listen(3000);

	app.get('/', function(req, response){

	 logger.info('Inside Get')

	  /*var d = domain.create(); 
	  
	  d.on('error',function(err){		
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.end('Page Not Found');
	  });	  
	  d.run(function(req, res) {
	    handleRequest(req, res);
      });  */
	  handleRequest(req, response);
	});	
	
	app.post('/upload', function(req, response) {        	
		fileUpload(req, response);
	});	
	
	app.get('/getFile', function(req, response) {        	
		fileDownload(req, response);
	});	
	
}

function handleRequest(req, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
  	response.end(form);
};

function fileUpload(request, response){
    logger.info('File Upload Starts');
    var destinationFile = fs.createWriteStream("destination.pdf");
    request.pipe(destinationFile);
    response.writeHead(200, {'Content-Type': 'text/html'});
  	response.end("File Uploaded");
	logger.info('File Upload Ends');
};

function fileDownload(request, response){   
   // var readStream = fs.createReadStream("destination.txt");
	//response.writeHead(200, {'Content-Type': 'text/txt'});
	//readStream.pipe(response);
    logger.info('File Download Starts');
	response.sendfile("destination.pdf");
	logger.info('File Download Ends');
};
