require("webduino-js");
require("webduino-blockly");

var Firebase = require('firebase');

var buzzer;
var rfid;
var oxxoCard;
var firebaseUrl = 'https://clock-in-out-b2825.firebaseio.com';
        
Firebase.initializeApp({
    databaseURL: firebaseUrl
});

console.log('Prepare...');

boardReady('2kza', function(board) {

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

    switch (uid) {
      case 'E04CD76D':
        buzzer.play(['C6'], ['8']);
        oxxoCard = Firebase.database().ref('oxxo/' + card[1] + card[2] + card[3] + '/');
        oxxoCard.push({
          card: 'E04CD76D',
          time: cardTime,
          during: card[0]
        });
        break;
      default:
        buzzer.play(['b4', 'f4'], ['8', '8']);
        unknowCard = Firebase.database().ref('unknow/' + card[1] + card[2] + card[3] + '/');
        unknowCard.push({
          card: uid,
          time: cardTime
        });
        break;
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
