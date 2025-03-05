//importing the HTTP module with require() function
const http = require("http");

http
  .createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello Node!\n");
  })
  .listen(8080);

console.log("My first Node test server is running on Port 8080.");

// importing the URL module
let addr = request.url;
let q = new URL(addr, "http://localhost:8080");

// 4.	For incoming requests, parse the request.url to determine if the URL
// contains the word “documentation” (request is one of the objects passed
// to createServer's callback function; it contains the request data,
// such as the requested URL). If it does, return the “documentation.html” file
// to the user; otherwise return the “index.html” file.
const http = require("http"),
  fs = require("fs"),
  url = require("url");

http
  .createServer((request, response) => {
    let addr = request.url,
      q = new URL(addr, "http://" + request.headers.host),
      filePath = "";

    fs.appendFile(
      "log.txt",
      "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log.");
        }
      }
    );

    if (q.pathname.includes("documentation")) {
      filePath = __dirname + "/documentation.html";
    } else {
      filePath = "index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  .listen(8080);
console.log("My test server is running on Port 8080.");