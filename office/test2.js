$(function() {
  var firebaseUrl = 'https://business-trip-fea58.firebaseio.com/';

  var tripUser = $('#tripUser');
  var previewUser = $('#previewUser');

  var tripLocation = $('#tripLocation');
  var previewLocation = $('#previewLocation');

  var tripStartDate = $('#tripStartDate');
  var tripStartTime = $('#tripStartTime');
  var tripEndDate = $('#tripEndDate');
  var tripEndTime = $('#tripEndTime');
  var tripTime = $('.tripTime');
  var previewTime = $('#previewTime');

  var tripCharge = $('#tripCharge');
  var tripHour = $('#tripHour');
  var previewCharge = $('#previewCharge');

  var trip4 = $('#trip4');
  var previewCost = $('#previewCost');
  var addBtn = $('#addBtn');

  var sumitBtn = $('#sumitBtn');
  var clearBtn = $('#clearBtn');

  var costTable;
  var costContent = '    <div class="cost-table">\n' +
    '        <span class="tripCostList"></span>\n' +
    '        <select class="tripCostType">\n' +
    '          <optgroup label="交通">' +
    '              <option value="高鐵">高鐵</option>\n' +
    '              <option value="台鐵">台鐵</option>\n' +
    '              <option value="捷運">捷運</option>\n' +
    '              <option value="公車">公車</option>\n' +
    '              <option value="計程車">計程車</option>\n' +
    '              <option value="飛機">飛機</option>\n' +
    '              <option value="船">船</option>\n' +
    '          </optgroup>' +
    '          <option value="住宿">住宿</option>\n' +
    '          <option value="其他">其他</option>\n' +
    '        </select>\n' +
    '        <input class="tripCostNum" type="number">\n' +
    '        <span>元，備註：</span>\n' +
    '        <input class="tripCostNote">\n' +
    '    </div>';
  var previewContent = '<div><span class="previewCostType"></span><span class="previewCostNum"></span><span class="previewCostNote"></span></div>';

  trip4.html(costContent);
  previewCost.html(previewContent);

  var tripCostType = $('.tripCostType');
  var tripCostNum = $('.tripCostNum');
  var tripCostNote = $('.tripCostNote');
  var previewCostType = $('.previewCostType');
  var previewCostNum = $('.previewCostNum');
  var previewCostNote = $('.previewCostNote');

  var data = {};
  data.cost = [];

  if (window.localStorage.busineseTrip) {
    var retrievedObject = localStorage.getItem('busineseTrip');
    data = JSON.parse(retrievedObject);
    if (data.user) {
      tripUser.val(data.user);
      previewUser.text(tripUser.val());
    }
    if (data.location) {
      tripLocation.val(data.location);
      previewLocation.text(tripLocation.val());
    }
    if (data.time) {
      tripStartDate.val(data.time[0]);
      tripStartTime.val(data.time[1]);
      tripEndDate.val(data.time[2]);
      tripEndTime.val(data.time[3]);
      previewTime.text(tripStartDate.val() + ' (' + tripStartTime.val() + ') --- ' + tripEndDate.val() + ' (' + tripEndTime.val() + ')');
    }
    if (data.charge) {
      tripCharge.val(data.charge);
    }
    if (data.hour) {
      tripHour.val(data.hour);
      previewCharge.text(tripCharge.val() * tripHour.val() + ' 元 ( 共 ' + tripHour.val() + ' 小時)');
    }
    if (data.cost) {
      var dataLength = data.cost.length;
      for (var i = 0; i < dataLength - 1; i++) {
        trip4.append(costContent);
      }
      tripCostType = $('.tripCostType');
      tripCostNum = $('.tripCostNum');
      tripCostNote = $('.tripCostNote');
      for (var i = 0; i < dataLength; i++) {
        tripCostType[i].value = data.cost[i].type;
        tripCostNum[i].value = data.cost[i].num;
        tripCostNote[i].value = data.cost[i].note;
        previewCost.append(previewContent);
      }
      previewCostType = $('.previewCostType');
      previewCostNum = $('.previewCostNum');
      previewCostNote = $('.previewCostNote');
      for (var i = 0; i < dataLength; i++) {
        previewCostType[i].innerHTML = '- ' + data.cost[i].type + '：';
        previewCostNum[i].innerHTML = data.cost[i].num + '元 ( ';
        previewCostNote[i].innerHTML = data.cost[i].note + ' )';
      }
      cost();
    } else {
      cost();
    }
  } else {
    previewUser.text(tripUser.val());
    data.user = tripUser.val();
    saveToLocalStorage();
  }


  tripUser.on('change', function() {
    previewUser.text(this.value);
    data.user = this.value;
    saveToLocalStorage();
  });
  tripLocation.on('keyup', function() {
    previewLocation.text(this.value);
    data.location = this.value;
    saveToLocalStorage();
  });
  tripTime.on('change', function() {
    var text = tripStartDate.val() + ' (' + tripStartTime.val() + ') --- ' + tripEndDate.val() + ' (' + tripEndTime.val() + ')';
    previewTime.text(text);
    data.time = [tripStartDate.val(), tripStartTime.val(), tripEndDate.val(), tripEndTime.val()];
    saveToLocalStorage();
  });
  tripCharge.on('keyup change', function() {
    var hr = tripHour.val();
    var val = tripCharge.val() * hr;
    previewCharge.text(val + ' 元 ( 共 ' + hr + ' 小時)');
    data.charge = tripCharge.val();
    saveToLocalStorage();
  });
  tripHour.on('keyup change', function() {
    var hr = tripHour.val();
    var val = tripCharge.val() * hr;
    previewCharge.text(val + ' 元 ( 共 ' + hr + ' 小時)');
    data.hour = hr;
    saveToLocalStorage();
  });

  addBtn.on('click', function() {
    trip4.append(costContent);
    previewCost.append(previewContent);
    cost();
  });

  sumitBtn.on('click', function() {
    if (data.user && data.time && data.loation && data.hour && data.charge && data.cost) {
      if (confirm("是否確定送出？")) {
        console.log(data);
        var dataBaseUrl = firebaseUrl + data.user + '/' + tripStartDate.val();
        var userFirebase = new Firebase(dataBaseUrl);
        userFirebase.push(data);
        sumitBtn.text('出差單完成 ( 點選重新送出 )');
      } 
    }else{
    	alert('表單尚未填寫完畢，請檢查後再送出');
    }
  });

  clearBtn.on('click', function() {
    if (confirm("真的要清除重填？")) {
      data = {};
      data.cost = [];
      window.localStorage.busineseTrip = '';
      window.location.reload();
    }
  });



  function cost() {
    tripCostType = $('.tripCostType');
    tripCostNum = $('.tripCostNum');
    tripCostNote = $('.tripCostNote');
    previewCostType = $('.previewCostType');
    previewCostNum = $('.previewCostNum');
    previewCostNote = $('.previewCostNote');
    countCost();
    tripCostType.on('change', countCost);
    tripCostNum.on('keyup change', countCost);
    tripCostNote.on('keyup', countCost);
  }

  function countCost() {
    for (var i = 0; i < tripCostType.length; i++) {
      previewCostType[i].innerHTML = '- ' + tripCostType[i].value + '：';
      previewCostNum[i].innerHTML = tripCostNum[i].value + '元 ( ';
      previewCostNote[i].innerHTML = tripCostNote[i].value + ' )';
      data.cost[i] = {
        type: tripCostType[i].value,
        num: tripCostNum[i].value,
        note: tripCostNote[i].value
      };
    }
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    window.localStorage.setItem('busineseTrip', JSON.stringify(data));
  }



});
