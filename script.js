$(document).ready(function() {
var v1zconde = "&appid=0672c5c44771cae78024eb3855e55f10";
var nowMoment = moment();
var citySearchListStringified = localStorage.getItem("citySearchList");
var citySearchList = JSON.parse(citySearchListStringified);
var dateToday = moment().format("MMMM Do YYYY");
var longitude;
var latitude;
searchValue = 2;
if (citySearchList == null) {
  citySearchList = {};
}

  init();

function init(){

  $("#forecast-w").hide();
  $("#current-w").hide();
  createCityList(citySearchList);
 
 
}

function forecast(city){
    $("forecast").empty();
    $("forecast-w").show();
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city +"&units=imperial" + v1zconde,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var allForecast = $("#forecast");
    for (i=1; i <6; i++){
    var forecastDay = $("<div>");
    forecastDay.addClass("col-md bg-primary text-white ml-3 mb-3 rounded text-center");
    forecastDay.attr("id", "forecast-"+i);
    var forecastDate = $("<div>").text(moment().add(i,'days').format('MM/DD/YY'));
    
    var weatherIcon = $("<img>");
    console.log(searchValue);
    weatherIcon.attr(
      "src",
      "https://openweathermap.org/img/w/" + response.list[searchValue].weather[0].icon + ".png"
    );
    var forecastTemp = $("<div>").text("Temp: " + response.list[searchValue].main.temp)
    var forecastHum = $("<div>").text("Humidity: " + response.list[searchValue].main.humidity)
    searchValue = searchValue + 8
    
    forecastDay.append(forecastDate);
    forecastDay.append(weatherIcon);
    forecastDay.append(forecastTemp);
    forecastDay.append(forecastHum);
    allForecast.append(forecastDay);
    
  }

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
  $("#city-date-icon").empty();
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
    searchValue = 2;
  //populateCityWeather(city, citySearchList);
  createCityList(citySearchList);
  weather(city);
  forecast(city);
  $("#current-w").show();
  $("#forecast-w").show();
  
  }

});

$("#city-list").on("click", "button", function(event) {
  event.preventDefault();
  searchValue = 2;
  var city = $(this).text();
  $("#forecast-w").show();
  $("#current-w").show();
  weather(city);
  forecast(city);
});

$("#clear-history").on("click", function() {
  $("#city-list").empty();
  $("#city-date-icon").empty();
  $("#forecast").empty();
  citySearchList = {};
  localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
})


});