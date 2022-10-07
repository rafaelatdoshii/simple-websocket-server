var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8000;

app.ws("/ws", function (ws, req) {
  ws.on("message", function (msg) {
    console.log(msg);
  });
});

var aWss = expressWs.getWss("/ws");

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

app.post("/msg", function (req, res) {
  aWss.clients.forEach(function (client) {
    client.send(req.body.message);
  });
  res.redirect("/");
});

app.listen(port);
console.log("Running server at port " + port);