/**
 * Unified server method
 *
 */

// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const trimPathRegex = /^\/+|\/+$/g;

// Unified server method
const unifiedServer = (req, res) => {
  // get url object from req url
  let parsedUrl = url.parse(req.url);

  //trim url and convert to lower case, ../Hello or /hello will route the same way
  let trimmedPath = parsedUrl.pathname.replace(trimPathRegex, "").toLowerCase();

  // get the body if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  //start read body
  req.on("data", data => {
    buffer += decoder.write(data);
  });
  // then
  req.on("end", () => {
    buffer += decoder.end();
    let data = {
      path: trimmedPath,
      payload: buffer
    };

    // Get the correct handler from path, otherwise will use notFound handler
    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // handler Called back method erturn
    chosenHandler(data, (statusCode, message) => {
      // Use the status code called back by the handler, or default status code 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      // Return the response
      res.setHeader("Content-type", "application/json");
      res.writeHead(statusCode);

      // Return message when route is OK, otherwise send not found
      message = typeof message === "object" ? message : { message: "empty" };
      let result = JSON.stringify(message);
      res.end(result);
    });
  });
};

/**
 * Define handlers
 *
 */
const handlers = {};

// Handling Hello route
handlers.hello = (data, callback) => {
  callback(200, {
    message: "Welcome to hello API",
    path_requested: data.path,
    data_sent: data.payload
  });
};
// Handling 404 not found route
handlers.notFound = (data, callback) => {
  callback(404, { message: "route not found", path_requested: data.path });
};

// Define a request router
const router = {
  hello: handlers.hello
};

module.exports = unifiedServer;
