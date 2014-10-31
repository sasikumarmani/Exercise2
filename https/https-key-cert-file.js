var https = require('https');
var fs = require('fs');

 
var options = {
  key: fs.readFileSync('19875079-localhost_3000.key'),
  cert:fs.readFileSync('19875079-localhost_3000.cert')
};

if (cluster.isMaster) {


}else{


}

https.createServer(options, function (req, res) {
  console.log("Https:Server Started");
  res.writeHead(200);
  res.end("hello world\n");  
}).listen(3000);