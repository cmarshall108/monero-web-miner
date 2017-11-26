const https = require("https");
const fs = require("fs");
const createProxy = require("coin-hive-stratum");

const proxy = createProxy({
  host: "pool.supportxmr.com:3333",
  port: 3333
});

const server = https.createServer({
  key: fs.readFileSync("certificates/key.pem"),
  cert: fs.readFileSync("certificates/cert.pem"),
});

server.listen(8892);
proxy.listen({
  server: server
});
