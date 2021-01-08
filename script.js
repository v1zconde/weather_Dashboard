$(document).ready(function() {
var v1zconde = "&appid=0672c5c44771cae78024eb3855e55f10";
var nowMoment = moment();
var citySearchListStringified = localStorage.getItem("citySearchList");
var citySearchList = JSON.parse(citySearchListStringified);
var dateToday = moment().format("MMMM Do YYYY");
var longitude;
var latitude;
if (citySearchList == null) {
  citySearchList = {};
}

  init();

function init(){

  createCityList(citySearchList);
// $("#forecast-w").hide();
// $("#current-w").hide();
 
}

function forecast(city){
    
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city +"&units=imperial" + v1zconde,
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });

}

function createCityList(citySearchList){
  $("#city-list").empty();
  
  var keys = Object.keys(citySearchList);
  for (var i = 0; i < keys.length; i++) {
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");
//making the first letter UpperCase
    var splitStr = keys[i].toLowerCase().split(" ");
  
    for (var j = 0; j < splitStr.length; j++) {
      splitStr[j] = splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
      console.log(splitStr[j]);
    }
    var titleCasedCity = splitStr.join(" ");
    console.log(titleCasedCity)
    cityListEntry.text(titleCasedCity);
    $("#city-list").append(cityListEntry);
  }
}


function weather(city){
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=imperial" + v1zconde,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var cwDate = $("<h4>").text(dateToday).addClass("text-center");
    var cwName = $("<h4>").text(response.name).addClass("text-center");
    var cwCurrentTemp = $("<p>").text("Current Temp: " + response.main.temp + "F");
    var cwCurrentHumidity = $("<p>").text("Current Humidity: " + response.main.humidity + "%");
    var cwWind = $("<p>").text("Current Wind: " + response.wind.speed + "MPH");
    longitude = response.coord.lon;
    console.log(longitude);
    latitude = response.coord.lat;
    console.log(latitude);
    var weatherIcon = $("<img>");
    weatherIcon.attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    $("#city-date-icon").append(cwName, cwCurrentTemp, cwCurrentHumidity, cwWind);
    cwName.append(cwDate);
    cwDate.append(weatherIcon);
    getUvIndex(longitude, latitude);
    
  });

};


function getUvIndex(longitude, latitude){
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/uvi?lat="+ latitude + "&lon="+ longitude + v1zconde,
    method: "GET"
  }).then(function(uvIndex) {
    console.log(uvIndex);
    var cwCurrentUv = $("<p>").text("Current uvIndex: "+  uvIndex.value);
    $("#city-date-icon").append(cwCurrentUv);
    
  });
}


$("#search-button").on("click", function(event) {
  event.preventDefault();
  var city = $("#city-input")
    .val()
    .trim()
    .toLowerCase();

  if (city != "") {
    //Check to see if there is any text entered
  
    citySearchList[city] = true;
  localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

  //populateCityWeather(city, citySearchList);
  createCityList(citySearchList);
  weather(city);
  forecast(city);
  $("#current-weather").show();
  $("#forecast-weather").show();
  }

});

$("#city-list").on("click", "button", function(event) {
  event.preventDefault();
  var city = $(this).text();

  weather(city);
  forecast(city);
  $("#current-weather").show();
  $("#forecast-weather").show();
});

$("#clear-history").on("click", function() {
  $("#city-list").empty();
  citySearchList = {};
  localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
})


});