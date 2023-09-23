var StaticServer = require('static-server');
var server = new StaticServer({
  rootPath: './dist/',            // required, the root of the server file tree
  port: 8000               // required, the port to listen

});
server.start(function () {
  console.log('Server listening to', server.port);
});
 
server.on('request', function (req, res) {
});
 
server.on('symbolicLink', function (link, file) {
  console.log('File', link, 'is a link to', file);
});
 
server.on('response', function (req, res, err, file, stat) {
});