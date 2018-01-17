require("webduino-js");
require("webduino-blockly");

var rfid;
var rgbled = {};
var rgbledState = {};
var timeout = {};
var poker = {
  '8AD81F2B': '方塊 A',
  'DEA51E2B': '梅花 A',
  '63481B2B': '紅心 A',
  '3C4B202B': '黑桃 A',
  '70FE212B': '藍色',
  'DA003BD5': '紅色',
  '700348D5': '綠色',
  '43B01F2B': '閃爍',
  '7B4B1B2B': '小',
  'CCFF1A2B': '大',
  '2D0542D5': '鬼'
};
var smartArr = ['6KJB', 'Lqpk', 'wakD', '8xwm', 'Zb22', 'xpJP', '5Kka', 'mDAm'];
var arr = ['10b49J1r', '10RrGGer'];

boardReady({
  board: 'Smart',
  device: '10b49J1r',
  transport: 'mqtt'
}, function(board) {
  console.log('RFID Ready...');
  rfid = getRFID(board);
  rfid.read();
  rfid.on("enter", function(uid) {
    console.log(uid, poker[uid]);
    smartArr.forEach(function(e) {
      clear(e);
    });
    if (uid == 'DA003BD5') {
      smartArr.forEach(function(e) {
        if (rgbled[e]) {
          rgbled[e].setColor('#ff0000');
        }
      });
    } else if (uid == '700348D5') {
      smartArr.forEach(function(e) {
        if (rgbled[e]) {
          rgbled[e].setColor('#00ff00');
        }
      });
    } else if (uid == '70FE212B') {
      smartArr.forEach(function(e) {
        if (rgbled[e]) {
          rgbled[e].setColor('#0000ff');
        }
      });
    } else if (uid == '43B01F2B') {
      smartArr.forEach(function(e) {
        if (rgbled[e]) {
          blink[e]();
        }
      });
    } else {
      smartArr.forEach(function(e) {
        if (rgbled[e]) {
          rgbled[e].setColor('#000000');
        }
      });
    }
  });
});

smartArr.forEach(function(e) {
  boardReady({
    board: 'Smart',
    device: e,
    transport: 'mqtt'
  }, true, function(board) {
    console.log(e + 'Ready...');
    rgbledState[e] = 0;
    rgbled[e] = getRGBLedCathode(board, 15, 12, 13);
  });
});

var blink = {};

smartArr.forEach(function(e) {
  blink[e] = function() {
    console.log(e, rgbledState[e]);
    if (rgbledState[e] == 0) {
      rgbledState[e] = 1;
      rgbled[e].setColor('#ffffff');
    } else {
      rgbledState[e] = 0;
      rgbled[e].setColor('#000000');
    }
    timeout[e] = setTimeout(blink[e], 250);
  }
});

function clear(e) {
  if (timeout[e]) {
    clearTimeout(timeout[e]);
    rgbledState[e] = 0;
  }
}
