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

// var http = require('http'),
var url = require('url');

var express = require('express');
var app = express();
var exec = require('child_process').exec;

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
* Command Config
******************************************************************************/
// commands for test
var allowed_cmd  = { 
                      "available-space":  'date',
                      "cleanup":          'ssh -o ConnectTimeout=3 pi@[device]; cd /home/pi/lmp; ./scripts/cleanup.sh',
                      "images-count" :    "ls -l . | wc -l", 
                      "lues-service":      'ps aux | grep "sudo python client.py" | grep -v "grep"',
                      "monitor-network" : "ping -c 3 -W 5 -q [device]",
                      "reboot":           'ssh -o ConnectTimeout=3 -i /Users/pgl/.ssh/id_rsa.pub pi@[device]; cd /home/pi/lmp; ./scripts/stop.sh; sudo shutdown -r now',
                      "shutdown":         'ssh -o ConnectTimeout=3 pi@[device]; cd /home/pi/lmp; ./scripts/stop.sh; sudo shutdown -h now',
                   },
// var allowed_cmd  = { 
//                       "available-space":  'ssh -o ConnectTimeout=3 pi@[device]; df -hm /home/pi',
//                       "cleanup":          'ssh -o ConnectTimeout=3 pi@[device]; cd /home/pi/lmp; ./scripts/cleanup.sh',
//                       "images-count" :    "ssh -o ConnectTimeout=3 pi@[device]; ls -l /home/pi/lmp/img/*.jpg | wc -l", 
//                       "lues-service":      'ssh -o ConnectTimeout=3 pi@[device]; ps aux | grep "sudo python client.py" | grep -v "grep"',
//                       "monitor-network" : "ping -c 3 -W 5 -q [device]",
//                       "reboot":           'ssh -o ConnectTimeout=3 -i /Users/pgl/.ssh/id_rsa.pub pi@[device]; cd /home/pi/lmp; ./scripts/stop.sh; sudo shutdown -r now',
//                       "shutdown":         'ssh -o ConnectTimeout=3 pi@[device]; cd /home/pi/lmp; ./scripts/stop.sh; sudo shutdown -h now',
//                    },
    device_ip_list = {
                    "rasp1" : "192.168.1.90", 
                    "rasp2" : "127.0.0.1", 
                    "rasp3" : "192.168.1.13", 
                    "rasp4" : "192.168.1.14",
                    "pcdiff" : "192.168.1.15"
                  };

function is_allowed(c){
  return allowed_cmd[c];
}

function prepare_cmd(cmd, device){
  return cmd.replace("[device]", device_ip_list[device]);
}

/******************************************************************************
* Main
******************************************************************************/
app.get('/', function(req, res) {
  res.render('pages/index', {
    app_title: app_title
  });
});

app.get('/api', function(req, res) {
  req.addListener('end', function () {
         
  });
  var parsedUrl = url.parse(req.url, true);
  var cmd = parsedUrl.query['cmd'];
  var device = parsedUrl.query['device'];
  var result = "";

  res.writeHead(200, {'Content-Type': 'application/json'});
  if ( device ) {
    if( cmd ) {
      if ( is_allowed(cmd)) {
        command = prepare_cmd(allowed_cmd[cmd], device);
        console.log(command);
        var child = exec(command, function (error, stdout, stderr) {
          result = '{"stdout": "' + stdout.replace(/\n/g, ' ') + '" ,"stderr":"' + stderr.replace(/\n/g, ' ') + '","cmd":"' + command + '"}';
          res.end(JSON.stringify(result) + '\n');
        });
      } else { // Cmd is not in allowed commandes
        console.log("The command '" + cmd + "' is not allowed !");
        result = '{"stdout":"' + '""' + '","stderr":"' + 'cmd is not allowed' + '","cmd":"' + cmd + '"}';
        res.end(JSON.stringify(result) + '\n');
      }
    } else {
      result = '{"stdout":"' + '""' + '","stderr":"' + 'cmd is mandatory' + '","cmd":"' + cmd + '"}';
      res.end(JSON.stringify(result) + '\n');
    }
  } else {
      result = '{"stdout":"' + '""' + '","stderr":"' + 'device is mandatory' + '","device":"' + device + '"}';
      res.end(JSON.stringify(result) + '\n');
  }
});


app.listen(port, host);
console.log('Server running at ' + thisServerUrl );
var uid = parseInt(process.env.SUDO_UID);
  if (uid) { process.setuid(uid); }
console.log('Server\'s UID is now ' + process.getuid());
    


