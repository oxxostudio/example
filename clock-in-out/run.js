require("webduino-js");
require("webduino-blockly");

var Firebase = require('firebase');

var buzzer;
var rfid;
var user;
var firebaseUrl = 'https://clock-in-out-b2825.firebaseio.com';

var list = [{
  Id: 'E04CD76D',
  Name: 'oxxo'
}, {
  Id: 'aa',
  Name: 'Marty'
}, {
  Id: 'F048D76D',
  Name: 'Sheng'
}, {
  Id: 'cc',
  Name: 'M.Z.'
}, {
  Id: 'dd',
  Name: 'Enya'
}, {
  Id: '003DD76D',
  Name: 'Lynn'
}];


Firebase.initializeApp({
  databaseURL: firebaseUrl
});

console.log('Prepare...');

boardReady({device:'2kza', multi: true}, function(board) {

  console.log('Board Ready!');

  board.systemReset();
  board.samplingInterval = 250;
  buzzer = getBuzzer(board, 9);
  rfid = getRFID(board);
  rfid.read();

  console.log('RFID Ready!');

  rfid.on('enter', function(uid) {

    var card = get_time();
    var cardDate = card[1] + '/' + card[2] + '/' + card[3];
    var cardTime = card[4] + ':' + card[5] + ':' + card[6];

    var unknow = 1;

    for (var i = 0; i < list.length; i++) {
      if (uid == list[i].Id) {
        unknow = 0;
        console.log(list[i].Name + ' : ' + cardDate + ' ' + cardTime);
        buzzer.play(['C6'], ['8']);
        user = Firebase.database().ref(list[i].Name + '/' + card[1] + card[2] + card[3] + '/');
        user.push({
          card: list[i].Id,
          time: cardTime,
          during: card[0]
        });
      } else {
        if (unknow == 1 && i == list.length-1) {
          console.log('unknow : ' + cardDate + ' ' + cardTime);
          buzzer.play(['b4', 'f4'], ['8', '8']);
          user = Firebase.database().ref('unknow/' + card[1] + card[2] + card[3] + '/');
          user.push({
            card: uid,
            time: cardTime
          });
        }
      }
    }

  });
});

function get_time() {
  var varDay = new Date(),
    varYear = varDay.getFullYear(),
    varMonth = varDay.getMonth() + 1,
    varDate = varDay.getDate(),
    varHours = varDay.getHours(),
    varMinutes = varDay.getMinutes(),
    varSeconds = varDay.getSeconds(),
    varGetTime = varDay.getTime();

  if (varMonth * 1 < 10) {
    varMonth = '0' + varMonth;
  }

  if (varDate * 1 < 10) {
    varDate = '0' + varDate;
  }

  if (varHours * 1 < 10) {
    varHours = '0' + varHours;
  }

  if (varMinutes * 1 < 10) {
    varMinutes = '0' + varMinutes;
  }

  if (varSeconds * 1 < 10) {
    varSeconds = '0' + varSeconds;
  }

  return [varGetTime, varYear, varMonth, varDate, varHours, varMinutes, varSeconds];
}
