// server.js
// load the things we need
var express = require('express');
var app = express();

app.use( express.static( "public" ) );
var app_title = "Nuage de mots";

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index', {
    	app_title: app_title
    });
});

app.listen(8080);
console.log('Listening on port 8080');