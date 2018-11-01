var express = require("express");
var mysql = require('mysql');
var app = express();
app.use(express.logger());

var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bf3c82b107eebd',
    password: '7c8be2db',
    database: 'heroku_52e91f225d931d5'
});

app.get('/', function (request, response) {
    response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    //console.log("Listening on " + port);
});