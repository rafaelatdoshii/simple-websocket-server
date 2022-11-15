var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('log-timestamp');
const port = 8000;

app.ws("/ws", function (ws, req) {

  ws.on("message", function (msg) {
    console.log(msg);
  });
  ws.on('close', function() {
    console.log('The connection was closed! ');
});
});

var aWss = expressWs.getWss("/ws");

aWss.on('connection', function(ws){
  console.log("Connection open");
});

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

app.post("/msg", function (req, res) {
  aWss.clients.forEach(function (client) {
    client.send(req.body.message);
  });
  res.redirect("/");
});


app.post("/msg/pong", function (_, res) {
  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify({
      "message": "server-pong",
      }));
  });
  res.redirect("/");
});

app.post("/msg/startpip", function (req, res) {
  const amount = req.body.amount;
  const tip = req.body.tip;
  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify(
      {
        "message": "server-pip-request",
        "amount": amount,
        "tip": tip,
        "timestamp": "43983",
        "transactionId": "transactionID",
        "doshiiPosId": "doshiiPosId",
        }
    ));
  });
  res.redirect("/");
});

app.listen(port);
console.log("Running server at port " + port);