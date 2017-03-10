var gps = require('wifi-location');
var ttn = require('ttn');
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var sock = null;
app.listen(80);

var region = 'eu';
var appId = '';
var accessKey = '';   // INSERT TTN accessKey
var client = new ttn.Client(region, appId, accessKey);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  setSocket(socket);
});

client.on('connect', function() {
  console.log('[DEBUG]','Connected to ttn network');
});

io.sockets.on('connection', function (socket) {
    socket.on('messageChange', function (data) {
      console.log(data);
      socket.emit('receive', data.message.split('').reverse().join('') );
    });
});

client.on('message', function (deviceId, msg) {
  //console.info('[INFO] ', 'Message:', deviceId, JSON.stringify(msg, null, 2));
  var formattedData = JSON.parse(JSON.stringify(msg, null, 2))
  formattedData.payload_raw = formattedData.payload_raw.data;
  //var raw = new Buffer(msg, 'base64');
  console.info(formattedData.payload_raw);
  console.log();
  console.log("lengte " + formattedData.payload_raw.length);
  var mac = [];
  var rssi = [];
  var tmp = "";
  for(i=0; i < formattedData.payload_raw.length; i++) {
      if((i + 1) % 7 == 0) {
         tmp = tmp.slice(0,-1);
         rssi = parseInt(formattedData.payload_raw[i]);
         console.log("mac " + tmp + " rssi " + rssi);
         mac.push({ mac: tmp, ssid: '', signal_level: "-" + rssi });
         i++;
         tmp = "";
      }
      var hex = parseInt(formattedData.payload_raw[i]).toString(16);
      tmp  = tmp + hex + ":";
  }
  getLocation(mac);
});

client.on('activation', function(deviceId, data) {
    console.log('[INFO] ', 'Activation:', deviceId, data);
});

client.on('error', function (err) {
  console.error('[ERROR]', err.message);
});

function setSocket(s) {
  sock = s;
  console.log("socket");
  console.log(s);
}

function getLocation(plop) {
  console.log("get location");
  console.log(plop);
    gps.getLocation(plop, function(err, loc){
      console.log("location: " + JSON.stringify(loc));
      console.log("https://www.google.com/maps/place/" + loc.latitude + "," + loc.longitude);
      console.log(loc.latitude + ", " + loc.longitude);
      console.log("error: " + err);
      if(sock != null) {
        io.sockets.emit('location', loc.latitude + "," + loc.longitude);
      }
    });
}
