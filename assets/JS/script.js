$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyA9NGulyUY-UffnWg3rPY1S1RNzjKBbuNA',
    authDomain: 'train-scheduler-f862f.firebaseapp.com',
    databaseURL: 'https://train-scheduler-f862f.firebaseio.com',
    projectId: 'train-scheduler-f862f',
    storageBucket: 'train-scheduler-f862f.appspot.com',
    messagingSenderId: '114711737276'
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //  var timeinM = prompt('enter time');
  // console.log(moment().format('hh:mm'));
  // // console.log(moment(timeinM, 'hh:mm').format('mm'));

  $('#submit-schedule').on('click', function() {
    event.preventDefault();

    // =========================================================================

    var tName = $('#train-name').val();

    var tDestination = $('#destination').val();

    var tFrequency = $('#frequency').val();

    var firstTime = $('#first-time').val();

    // first time
    var firstTimeConverted = moment(firstTime, 'HH:mm').subtract(1, 'years');
    //console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    //console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm'));

    // Difference between the times
    var anotTime = moment().diff(moment().unix(firstTime));
    console.log('anotTime: ' + anotTime);
    var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
    // console.log('DIFFERENCE IN TIME: ' + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    //console.log(tRemainder);

    // Minute Until Next Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    //console.log('MINUTES TILL TRAIN: ' + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, 'minutes');

    var nextTrainTime = nextTrain.format('LTS').toString();
    // console.log(nextTrainTime.toString());

    //console.log('ARRIVAL TIME: ' + moment(nextTrain).format('hh:mm'));

    // store in an object

    var trainSchedule = {
      name: tName,
      dest: tDestination,
      frequency: tFrequency,
      next: nextTrainTime,
      minsToNext: tMinutesTillTrain.toString()
    };

    // take care of empty fields
    if (
      tName === '' ||
      tDestination === '' ||
      tFrequency === '' ||
      firstTime === ''
    ) {
      return;
    } else {
      database.ref().push(trainSchedule);
    }

    $('#train-name').val('');
    $('#destination').val('');
    $('#first-time').val('');
    $('#frequency').val('');
  });

  database.ref().on('child_added', function(snapshot) {
    var newChild = snapshot.val();
    console.log(newChild);

    var row = $('<tr>');

    var rowName = $('<td>');
    rowName.text(newChild.name);
    row.append(rowName);

    var rowDest = $('<td>');
    rowDest.text(newChild.dest);
    row.append(rowDest);

    var rowFreq = $('<td>');
    rowFreq.text(newChild.frequency);
    row.append(rowFreq);

    var rowNextTime = $('<td>');
    rowNextTime.text(newChild.next);
    row.append(rowNextTime);

    var rowNextMin = $('<td>');
    rowNextMin.text(newChild.minsToNext);
    row.append(rowNextMin);

    $('#data').append(row);
  });
});
