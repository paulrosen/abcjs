/**
 * A minimal web server, serving the /tests directory so that the test
 * pages can be accessed without CORS.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const host = 'localhost';
const port = 8000;

// Base Directory - Assuming minimal-http-server
// will be accessed  from its own folder.
const baseDir = path.join(__dirname, './');

const requestListener = function (request, response) {
  response.setHeader('Content-Type', 'text/html');

  const parsedUrl = url.parse(request.url, true);
  let pathName = parsedUrl.pathname;

  // load content
  fs.readFile(`${baseDir}${pathName}`, (error, data) => {
    if (!error) {
      response.writeHead(200);
      response.end(data);
    } else {
      console.log(error);
      response.writeHead(404);
      response.end('404 - File Not Found');
    }
  });

  //response.writeHead(200);
  //response.end('My first server!');
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
