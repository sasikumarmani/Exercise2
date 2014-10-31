var cluster = require('cluster');
var https = require('https');
var fs = require('fs');
var numCPUs = require('os').cpus().length;
var domain = require('domain');
var express = require('express');
var app = express();


var winston = require('winston');

var logger = new (winston.Logger)({  
    transports: [
        new (winston.transports.Console)({ level: 'info' }),
        new (winston.transports.File)({ filename: __dirname + 'reggie_node.log', level: 'info' })
    ]
});


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

	app.get('/', function(req, res){

	 logger.info('Inside Get')

	  var d = domain.create(); 
	  
	  d.on('error',function(err){		
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.end('Page Not Found');
	  });	  
	  d.run(function() {
	    handleRequest(req, res);		
      });  
	});	
}

function handleRequest(req, res){
  res.writeHead(200);
  res.end("hello world\n"); 
};