// Load the http module to create an http server.
const http = require("http");
const fs = require("fs");
const url = require("url");
const { exec } = require("child_process");

// Create a function to handle every HTTP request
function handler (req, res) {
  // eslint-disable-next-line n/no-deprecated-api
  const { pathname } = url.parse(req.url);
  if (pathname === "/") {
    fs.readFile("./index.html", function (error, html) {
      if (error) throw error;
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(html);
    });
  } else if (pathname === "/npmInstall") {
    exec("npm i", function (err, stdout, stderr) {
      if (err) console.error(stderr);
      console.log(stdout);
    });
  } else if (pathname === "/npmStart") {
    exec("npm run start", function (err, stdout, stderr) {
      if (err) console.error(stderr);
      console.log(stdout);
    });
  } else if (pathname === "/npmTestCases") {
    exec("npm run test", function (err, stdout, stderr) {
      if (err) console.error(stderr);
      console.log(stdout);
    });
  } else if (pathname === "/killServer") {
    exec("npx kill-port 8000", function (err, stdout, stderr) {
      if (err) console.error(stderr);
      console.log(stdout);
    });
  }
}

// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(4000, function (err) {
  if (err) {
    console.log("Error starting http server");
  } else {
    console.log(
      "Server running at http://127.0.0.1:4000/ or http://localhost:4000/"
    );
  }
});
