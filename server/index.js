"use strict";

var express = require("express");
var app = express();
var server = require("http").Server(app);
var path = require("path");
var logger = require("morgan");
var router = require("routes");

app.set("port", process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set("ip", process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../browser")));

app.get("/", function (req, res) { 
  res.sendFile(path.join(__dirname, "./layout.html")); 
});

app.use("/", router);


server.listen(app.get("port"), app.get("ip"), function () {
  console.log("Server running at %s:%d", app.get("ip"), app.get("port"));
});

app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    console.log({error: err});
    res.send(err);
});
