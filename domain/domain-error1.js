var http = require('http');
var domain = require('domain').create();

http.createServer(function (request, response) {   
    
     domain.on('error',function(err){		
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Service Failure');
	 });	
	 
	 domain.run(function() {	 
		console.log('Inside Run');
		handleRequest(request,response);
		console.log('After handleRequest');
	 });
	 
	 response.end('Hello World\n');
}).listen(3000);
