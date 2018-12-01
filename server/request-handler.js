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
    
    var body = '';
    request.on('data', function (data) {
      
      body += data;
      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        request.connection.destroy();
      }
          
    });

    request.on('end', function () {
      var post = JSON.parse(body);
      console.log(post);
      storage.storage.setData(post);
      output = JSON.stringify({'results': body});
    });

  }

  response.writeHead(statusCode, headers);
  response.write( output );
  response.end();
};



exports.requestHandler = requestHandler;