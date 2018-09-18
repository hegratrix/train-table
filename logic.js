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
let userRef = db.ref('users')
//    let time = moment().format("HH:mm")

$(document).ready( function () {
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
      addToTable()
    }
  })
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

function addToTable (){
  
}