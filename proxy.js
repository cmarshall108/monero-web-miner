const createProxy = require("coin-hive-stratum");
const proxy = createProxy({
  host: "la01.supportxmr.com",
  port: 3333
});


// Create an HTTPS server
const fs = require("fs");
const server = require("https").createServer({
  key: fs.readFileSync("certificates/server.key"),
  cert: fs.readFileSync("certificates/server.crt")
});

server.listen(8892);
proxy.listen({
  server: server
});
