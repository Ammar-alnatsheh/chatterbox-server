var storage = require('./storage');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode = 404;
  var url = request.url;
  var method = request.method;
  var output = 'The server can\'t handle the request.';
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'application/json';

  if (method === 'GET' && url === '/classes/messages') {
    statusCode = 200;
    output = JSON.stringify({'results': storage.storage.getData()});

  }
  
  if (method === 'POST' && url === '/classes/messages') {
    statusCode = 201;
    var body = [];
    request.on('data', (chunk) => {
      console.log(chunk.toString());
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body);
    });
    console.log(body);
    storage.storage.setData(body);
    output = JSON.stringify({'results': body});
  }

  response.writeHead(statusCode, headers);
  response.write( output );
  response.end();
};



exports.requestHandler = requestHandler;