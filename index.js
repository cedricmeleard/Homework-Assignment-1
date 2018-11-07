/**
 * Simple API return
 *
 */

// Dependencies
const http = require("http");
const https = require("https");
const fs = require("fs");
const unifiedServer = require("./server");

// Create an HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start HTTP server listening on port 3000
httpServer.listen(3000, () => console.log("HTTP server started on port 3000"));

// Instanciating HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

// Create an HTTPS server
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start HTTPS server listening on port 3001
httpsServer.listen(3001, () =>
  console.log("HTTPS server started on port 3001")
);
