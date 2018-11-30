

var dangerStat = [];
var printedPoints = {
  x: [],
  y: []
};

var longLatAssault = {
  x: [], 
  y: []
};

var longLatTheft = {
  x: [],
  y: []

};

var longLatBurglary = {
  x: [],
  y: []
};

var longLatRobbery = {
  x: [],
  y: []
};
 
var longLatVehicleTheft = {
  x: [],
  y: []
};


$.ajax({
  url: "https://data.sfgov.org/resource/cuks-n6tp.json",
  type: "GET",
  data: {
    "$limit" : 5000,
    "$$app_token" : "Q6SHiWLggs1tj51Wp1Y9CagsX"
  }
}).done(function(data) {
  //alert("Retrieved " + data.length + " records from the dataset!");
  //console.log(data);
  dangerData(data);
  sortData(data);
  console.log(longLatAssault);
});

function dangerData(data){
  for (var i = 0; i<5000; i++){
    if (data[i].category == "ASSAULT" || data[i].category == "LARCENY/THEFT" || data[i].category == "BURGLARY" || data[i].category == "ROBBERY" || data[i].category == "VEHICLE THEFT"){
      dangerStat[i] = data[i];
      printedPoints.x.push(data[i].x);
      printedPoints.y.push(data[i].y);
    }
  }
}

function sortData(dangerStat){
  var j = 0;
  for (var i = 0; i<5000; i++){
    
    if (dangerStat[i].category == "ASSAULT"){
      longLatAssault.x.push(dangerStat[i].x);
      longLatAssault.y.push(dangerStat[i].y);
     
    } else if(dangerStat[i].category == "LARCENY/THEFT"){
      longLatTheft.x.push(dangerStat[i].x);
      longLatTheft.y.push(dangerStat[i].y);
   
    } else if(dangerStat[i].category == "BURGLARY"){
      longLatBurglary.x.push(dangerStat[i].x);
      longLatBurglary.y.push(dangerStat[i].y);

    } else if(dangerStat[i].category == "ROBBERY"){
      longLatRobbery.x.push(dangerStat[i].x);
      longLatRobbery.y.push(dangerStat[i].y);
  
    }else if(dangerStat[i].category == "Vehicle Theft"){
      longLatVehicleTheft.x.push(dangerStat[i].x);
      longLatVehicleTheft.y.push(dangerStat[i].y);
    } 
  }
}

function getLongLat(myLocation){
  var x = 0; //chosen lat distance to show the crime spots from geo location
  var y = 0; //chosen long distance to show crime spot from geo location
  var radLongLat = {
    x: [], 
    y: []
  };

  for (var i = 0; i < dangerStat.length;  i++) {
    if ((dangerStat.x < (myLocation+x) && dangerStat.y < (myLocation+y)) && (dangerStat.x > (myLocation-x) && dangerStat.y > (myLocation-y))) {
      radLongLat.x.push(dangerStat[i].x);
      radLongLat.y.push(dangerStat[i].y);
    }
  }
  return radLongLat;
}

function getLongLat(myLocation, array){
  var x = 0.0020; //chosen lat distance to show the crime spots from geo location
  var y = 0.0020; //chosen long distance to show crime spot from geo location
  var radLongLat = {
    x: [], 
    y: []
  };

  for (var i = 0; i < array.length;  i++) {
    if ((array.x[i] < (myLocation+x) && array.y[i] < (myLocation+y)) && (array.x[i] > (myLocation-x) && array.y[i] > (myLocation-y))){
      radLongLat.x.push(array.x[i]); 
      radLongLat.y.push(array.y[i]);
    }
  }
  return radLongLat;
}

function mileConverter(mile){
  return (mile/69);
}

function kmConverter(km){
  return (km/111);
}


function getLongLat(myLocation, array, radius){
  var x = radius; //chosen lat distance to show the crime spots from geo location
  var y = radius; //chosen long distance to show crime spot from geo location
  var radLongLat = {
    x: [], 
    y: []
  };

  for (var i = 0; i < array.length;  i++) {
    if ((array.x[i] < (myLocation+x) && array.y[i] < (myLocation+y)) && (array.x[i] > (myLocation-x) && array.y[i] > (myLocation-y))){
      radLongLat.x.push(array.x[i]);
      radLongLat.y.push(array.y[i]);
    }
  }
  return radLongLat;
}


$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyBbKN_TW5CuyC1tyDa_TZZpb_b6jDj5x8I",
        authDomain: "nightcrawlers-1543299103112.firebaseapp.com",
        databaseURL: "https://nightcrawlers-1543299103112.firebaseio.com",
        projectId: "nightcrawlers-1543299103112",
        storageBucket: "nightcrawlers-1543299103112.appspot.com",
        messagingSenderId: "122175939714"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    var name = "";
    var phone = "";

    $("#logInBnt").on("click", function (event) {
        event.preventDefault();
        name = $("#inlineFormInput").val().trim();
        phone = $("#inlineFormInputGroup").val().trim();

        database.ref().set({
            name: name,
            phone: phone
        });
    });

    database.ref().on("value", function (snapshot) {
        $("#emergency-link").text(snapshot.val().name).attr("href", "tel:" + snapshot.val().phone)
    });

    $("#run-search").on("click", function (event) {
        $(".popup-bg").show();
        $(".popup-buttons").show();
        $(".popup-bg").on("click", function (event) {
            $(".popup-bg").hide();
            $(".popup-buttons").hide();
        });
    });
});

var map, heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.775, lng: -122.434},
    mapTypeId: 'satellite'
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(printedPoints),
    map: map
  });
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints(array) {

  var heatPoints = [];
  
  for (var i = 0; i<array.length; i++){
    heatPoints.push(new google.maps.LatLng(array.x[i], array.y[i]));
  }
  console.log(heatPoints);
  return heatPoints;
  
}


