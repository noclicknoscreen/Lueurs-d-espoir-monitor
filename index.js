#!/usr/local/bin/node
/*
** shell-server.js returns json response with the stdout and stderr of a shell command
**
**
** @Author: Nestor Urquiza
** @Date: 09/29/2011
**
*/
 
/*
* Dependencies
*/
var http = require('http'),
    url = require('url'),
    exec = require('child_process').exec;
 
/*
* Server Config
*/
var host = "127.0.0.1",
    port = "8080",
    thisServerUrl = "http://" + host + ":" + port;
 
/*
* Command Config
*/
var allowed_cmd  = { 
                      "available_space":  "value",  "value", 'ssh -o ConnectTimeout=3 pi@[device]; df -h /home/pi',
                      "cleanup":          'ssh -o ConnectTimeout=3 pi@[device]; cd /home/pi/lmp; ./scripts/cleanup.sh',
                      "images_count" :    "ssh -o ConnectTimeout=3 pi@[device]; ls -l /home/pi/lmp/img/ | wc -l", 
                      "lmp_service":      'ssh -o ConnectTimeout=3 pi@[device]; ps aux | grep "sudo python client.py" | grep -v "grep"',
                      "monitor_network" : "ping -c 3 -W 5 -q [device]"
                      "reboot":           'ssh -o ConnectTimeout=3 pi@[device]; cd /home/pi/lmp; ./scripts/stop.sh; sudo shutdown -r now',
                      "shutdown":         'ssh -o ConnectTimeout=3 pi@[device]; cd /home/pi/lmp; ./scripts/stop.sh; sudo shutdown -h now',
                   },
    device_ip_list = {
                    "rasp1" : "192.168.1.11", 
                    "rasp2" : "192.168.1.12", 
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

/*
* Main
*/
http.createServer(function (req, res) {
  req.addListener('end', function () {
         
  });
  var parsedUrl = url.parse(req.url, true);
  var cmd = parsedUrl.query['cmd'];
  var device = parsedUrl.query['device'];
  var result = "";

  res.writeHead(200, {'Content-Type': 'text/plain'});
  if ( device ) {
    if( cmd ) {
      if ( is_allowed(cmd)) {
        command = prepare_cmd(allowed_cmd[cmd], device);
        console.log(command);
        var child = exec(command, function (error, stdout, stderr) {
          result = '{"stdout":' + stdout + ',"stderr":"' + stderr + '","cmd":"' + command + '"}';
          res.end(result + '\n');
        });
      } else { // Cmd is not in allowed commandes
        console.log("The command '" + cmd + "' is not allowed !");
        result = '{"stdout":"' + '' + '","stderr":"' + 'cmd is not allowed' + '","cmd":"' + cmd + '"}';
        res.end(result + '\n');
      }
    } else {
      result = '{"stdout":"' + '' + '","stderr":"' + 'cmd is mandatory' + '","cmd":"' + cmd + '"}';
      res.end(result + '\n');
    }
  } else {
      result = '{"stdout":"' + '' + '","stderr":"' + 'device is mandatory' + '","device":"' + device + '"}';
      res.end(result + '\n');
  }
 
}).listen(port, host);
console.log('Server running at ' + thisServerUrl );
