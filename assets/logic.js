var config = {
  apiKey: "AIzaSyB0XQNsyPmx_iyJ0aBqVDrJDdC9GzMbw-A",
  authDomain: "my-train-table.firebaseapp.com",
  databaseURL: "https://my-train-table.firebaseio.com",
  projectId: "my-train-table",
  storageBucket: "",
  messagingSenderId: "795384557095"
};
firebase.initializeApp(config);
 
let db = firebase.database()
let userRef = db.ref()
console.log(userRef)
$(document).ready(function (){
  setInterval (function() {
    let time = moment().format("HH:mm:ss")
    $('#time').text('Current Time: '+time)
  },  1000)
})


$('#submit').click( function (event) {
  event.preventDefault()
  const trainName = $('#name-input').val()
  const trainDestination = $('#destination-input').val()
  const trainTime = $('#time-input').val()
  const trainFrequency = $('#frequency-input').val()
  let status = true
  let timeValidated = timeValidation(trainTime)
  
  if (trainName.length < 1) {
    $('#trainName').css({'color': 'red'})
  $('#trainName').text('Please enter a train name')
  status = false
} else {
  $('#trainName').css({'color': "rgb(82, 14, 54)"})
  $('#trainName').text('Train Name')
}
if (trainDestination.length < 1) {
  $('#destination').css({'color': "red"})
  $('#destination').text('Please enter a destination')
  status = false
} else {
  $('#destination').css({'color': "rgb(82, 14, 54)"})
  $('#destination').text('Destination')
}
if (timeValidated === false || trainTime === '') {
  $('#trainTime').css({'color': "red", "font-weight": "bold"})
  $('#trainTime').text('Please enter a valid time')
  status = false
} else {
  $('#trainTime').css({'color': "rgb(82, 14, 54)", "font-weight": "normal"})
  $('#trainTime').text('Train Time')
}
if (trainFrequency === '' || trainFrequency < 1) {
  console.log(trainFrequency)
  $('#frequency').css({'color': "red"})
  $('#frequency').text('Please enter a valid frequency')
  status = false
} else {
  $('#frequency').css({'color': "rgb(82, 14, 54)"})
  $('#frequency').text('Frequency')
}
if (status === true) {
  addUser(trainName, trainDestination, trainTime, trainFrequency)
  $('.form-control').val('')
}
})

function timeValidation (time) {
  let hours = time.split(':')[0]
  let minutes = time.split(':')[1]
  if (time === "" || time.indexOf(':') === -1){
    return false
  } else if (hours === "" || isNaN(hours) || hours > 23) {
    return false
  } else if (minutes === "" || isNaN(minutes) || minutes > 60) {
    return false
  } else {
    return true
  }
}

function addUser (Name, Destination, Time, Frequency) {
  userRef.push ({
    Name,
    Destination,
    Time,
    Frequency
  })
}

userRef.on("child_added", function(snapshot) {
  let nameOfTrain = snapshot.val().Name
  let destinationOfTrain = snapshot.val().Destination
  let timeOfTrain = snapshot.val().Time
  let frequencyOfTrain = snapshot.val().Frequency
  let nextArrival = nextArrivalCalculator(timeOfTrain, frequencyOfTrain)
  let minutesLeft = minutesLeftCalculator(timeOfTrain, frequencyOfTrain)
  let id = snapshot.key
  let newRow = $("<tr>").append(
    $("<td>").text(nameOfTrain),
    $("<td>").text(destinationOfTrain),
    $("<td>").text(timeOfTrain),
    $("<td>").text(frequencyOfTrain),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesLeft),
    $("<td>").html(`<button id="remove" type='button' onclick="removeTrain('${id}')">Remove</button>`)
  )
  $("#train-table > tbody").append(newRow)
})

function nextArrivalCalculator (firstTime, frequency) {
  let firstTimeConverted = moment(firstTime, "HH:mm").format("HH:mm")
  let currentTime= moment().format("HH:mm")
  let difference = moment(currentTime, "HH:mm").diff(moment(firstTimeConverted, "HH:mm"), 'minutes')
  if (difference < 0) {
    return firstTime
  } else {
    let tRemainder = difference % frequency
    let minutesUntil = frequency - tRemainder
    let nextTrain = moment(currentTime, "HH:mm").add(minutesUntil, 'minutes').format("HH:mm")
    return nextTrain
  }
}

function minutesLeftCalculator(firstTime, frequency) {
  let firstTimeConverted = moment(firstTime, "HH:mm").format("HH:mm")
  let currentTime= moment().format("HH:mm")
  let difference = moment(currentTime, "HH:mm").diff(moment(firstTimeConverted, "HH:mm"), 'minutes')
  if (difference > 0) {
    let tRemainder = difference % frequency
    let minutesUntil = frequency - tRemainder
    return minutesUntil
  } else {
    minutesUntil = difference*-1
    return minutesUntil
  }
}

function removeTrain (whichTrain) {
  userRef.child(whichTrain).remove()
  location.reload()
}