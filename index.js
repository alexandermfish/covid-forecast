var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT
    3000;

app.use(express.static(path.join(__dirname, '.')))

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));

});

app.listen(port);