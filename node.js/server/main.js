var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var gps = require('wifi-location');
//beelan
var ttn = require('ttn'),
  path = require('path');
var fetch = require('node-fetch');
var atob = require('atob');
var math = require('mathjs');
var convertHex = require('convert-hex')
//------------------------
var sock = null;
var appId = 'tishcatrack'; // INSERT TTN YOUR AppEUI
var accessKey = 'ttn-account-v2.NuxDXbvuSyi0SJlXY0N5IOcZYyEgiyRS-btAukllQWI'; // INSERT TTN accessKey
var client = new ttn.Client('eu', appId, accessKey);
//----------------Api beelan----------------------------
const url = 'http://web.beelan.mx/api/upLink/1111111111111111';
var SendSocket = []
const getData = () => {
  fetch(url)
    .then((response) => response.json())
    .then((response) => response.slice(Math.max(response.length - 1, 1))) //-10
    .then((response) => parseData(response))
    //  .then((response) => console.log(response)) //-10
    .then((response) => SendSocket = response) //-10

    //.then((response) => console.log(response)) //-10
    .catch((err) => console.log(err));
}

const parseData = (data) => {
  // la data de cada uno de los objetos sera convertida de base64 a hexa y de hexa a decimal
  return data.map((item) => {
    //console.log(base64toHEX(item.data))
    let wero = {};
    wero.data = parseHexString(base64toHEX(item.data));
    return wero;
  })
}
const base64toHEX = (base64) => {
  const raw = atob(base64);
  let HEX = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    HEX += (hex.length === 2 ? hex : `0${hex}`);
  }
  return HEX.toUpperCase();
}

function parseHexString(str) {

  var result = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);

  }
  //console.log(result);
  return result;
}

function corrimiento(data) {
  pos = {
    lat: (data[4] + (data[3] << 8) + (data[2] << 16)) / 10000,
    lng: (-1) * ((data[7] + (data[6] << 8) + (data[5] << 16)) / 10000),
    //alt: ((data[10] + (data[9] << 8) + (data[8] <<16 )) / 100)
  };
  return pos;
}

function getLocation(plop) {
  console.log("get location");
  console.log(plop);
  gps.getLocation(plop, function(err, loc) {
    console.log("location: " + JSON.stringify(loc));
    console.log("https://www.google.com/maps/place/" + loc.latitude + "," + loc.longitude);
    console.log(loc.latitude + ", " + loc.longitude);
    console.log("error: " + err);
    var d = new Date();
    console.log(' Hora ' + d.getHours() + ":" + d.getMinutes() + "");
    io.sockets.emit('location', {
      latitu: loc.latitude,
      longi: loc.longitude
    });

  });
}
const runArray = (data) => {
  return data.map((item) => {
    return parseHexString(item.data);
  })
}
//------------------ ( TTN ) ---------------------------
client.on('connect', function() {
  console.log('Conectado a TTN');
});

setInterval(() => {
  getData();
  if (SendSocket.length > 0) {
    console.log(SendSocket[0].data);
    console.log("length " + SendSocket[0].data.length);
    var mac = [];
    var rssi = [];
    var tmp = "";
    for (i = 0; i < SendSocket[0].data.length; i++) {
      if ((i + 1) % 7 == 0) {
        tmp = tmp.slice(0, -1);
        rssi = parseInt(SendSocket[0].data[i]);
        console.log("mac " + tmp + " rssi " + rssi);
        mac.push({
          mac: tmp,
          ssid: '',
          signal_level: "-" + rssi
        });
        i++;
        tmp = "";
      }
      var hex = parseInt(SendSocket[0].data[i]).toString(16);
      tmp = tmp + hex + ":";
    }
    getLocation(mac);
  }
}, 10000); //

//------------------------------------------------------
app.use(express.static('public'));

//--------------------------------------------
//        sql
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '',
  port: 3306
});

connection.connect(function(error) {
  if (error) {
    throw error;
  } else {
    console.log('Conexion correcta a base de datos.');
  }
});

//-------------------------( SOCKETS)------------------------------------
io.sockets.on('connection', function(socket) {
  console.log("Usuario Conectado por sockets");

});


//---------------------(SERVER)-----------------------


server.listen(8080, function() {
  console.log("Servidor corriendo en http://localhost:8080");
});
