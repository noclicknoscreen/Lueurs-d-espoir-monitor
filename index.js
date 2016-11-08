#!/usr/local/bin/node
/******************************************************************************
** index.js Serveur de monitoring de LU.ES_
**
**
** @Author: Nestor Urquiza - Initial commiter - 09/29/2011
** @modified : Pierre-Gilles Levallois - nøclick.nøscreen_ - 23/10/2016
**
******************************************************************************/
 
/******************************************************************************
* Global variables
******************************************************************************/
var app_title = "Nuage de mots";
/******************************************************************************
* Dependencies
******************************************************************************/

var url = require('url');

var express = require('express');
var app = express();

app.use( express.static( "public" ) );

// set the view engine to ejs
app.set('view engine', 'ejs');
 
/******************************************************************************
* Server Config
******************************************************************************/
var host = "127.0.0.1",
    port = "8080",
    thisServerUrl = "http://" + host + ":" + port;

/******************************************************************************
* Main
******************************************************************************/
app.get('/', function(req, res) {
  res.render('pages/index', {
    app_title: app_title
  });
});

app.listen(port, host);
console.log('Server running at ' + thisServerUrl );
var uid = parseInt(process.env.SUDO_UID);
  if (uid) { process.setuid(uid); }
console.log('Server\'s UID is now ' + process.getuid());
    


