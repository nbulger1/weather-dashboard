//User clicks on search button
//City is added to the search history by appending a child button into the search-history-container with the input field text
//fetch command asks for the lat long of the city from openweather
//then fetch command asks for the weather conditions at that lat long
//once data is return as an object - function traverses the data to get the necessary items
//necessary items are added to the appropriate containers using append children within a function
//one function for the today weather
//one function for the 5 day forecast weather that can take each date and populate from there

//Local Storage - pull from the input field and save into an array in local storage as long as the city isn't already present

//Event handler for submit button
var submitEl = document.querySelector(".submit");
var searchHistoryContainerEl = document.querySelector(".search-history-container");
var cityEntryEl = document.querySelector(".city-entry");
var todayCardContainerEl = document.querySelector(".today-card-container");
var fivedayContainerEl = document.querySelectorAll(".five-day-container");

function submitButtonHandler() {
    var citySubmit = JSON.parse(localStorage.getItem("cities")) || [];
    var cityEntryValueEl = document.querySelector(".city-entry").value.trim();

    //If the current citySubmit array doesn't contain the city entered then push it to the array and add a search history button
    if(!citySubmit.includes(cityEntryValueEl)){
        citySubmit.push(cityEntryValueEl);
        var cityHistoryEl = document.createElement("button");
        cityHistoryEl.textContent = cityEntryValueEl;
        cityHistoryEl.classList = "btn btn-primary search-history";
        searchHistoryContainerEl.appendChild(cityHistoryEl);
        cityEntryEl.value = "";
    } else {
        alert("That city is already in your recents!");
    };

    localStorage.setItem("cities", JSON.stringify(citySubmit));

    var city = cityEntryEl.value.trim();

    if(city){
        getCurrentWeather(city);
        todayCardContainerEl.textContent = "";
        fivedayContainerEl.textContent = "";
    };

};

submitEl.addEventListener('click', submitButtonHandler);

//One function for getting the lat long of the city entered
var getCurrentWeather = function(city){
    var cityApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + '&limit=5&appid=27d064bc9585ece2266de44bda36203b';
    // var latLongApiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=27d064bc9585ece2266de44bda36203b";

    fetch(cityApiUrl)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            var lat = data.lat;
            var long = data.long;
        //   });
        // } else {
        //   //404 or 500 error will display in alert box
        //   alert('Error: ' + response.statusText);
        // }
        return fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=27d064bc9585ece2266de44bda36203b");
        }).then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                console.log(data);
                displayCurrentWeather(data);
              });
            } else {
              alert('Error: ' + response.statusText);
            }
        });
    };
});

function displayCurrentWeather(repos) {

    if(repos.length === 0){
        todayCardContainerEl.textContent = "No repositories found";
        return;
    };

    for(var i=0; i<repos.length; i++){
        var date = repos[i].dt;
        var icon = repos[i].weather.icon;
        var temperature = "Temp: " + repos[i].main.temp;
        var wind = "Wind: " + repos[i].wind.speed + "MPH";
        var humidity = "Humidity: " + repos[i].main.humidity + "%";
        var uvIndex = "UV Index: " + repos[i];

        var dateEl = document.createElement('p')
        var temperatureEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');
        var uvIndexEl = document.createElement('p');

        todayCardContainerEl.appendChild(dateEl);
        todayCardContainerEl.appendChild(temperatureEl);
        todayCardContainerEl.appendChild(windEl);
        todayCardContainerEl.appendChild(humidityEl);
        todayCardContainerEl.appendChild(uvIndexEl);
    };

};

//Figure this out after current weather
// var getFiveDayForecast = function(lat, long){
    
//     var apiUrl = "api.openweathermap.org/data/2.5/forecast?" + lat + "&lon=" + long + "&appid=27d064bc9585ece2266de44bda36203b";
// };

//Figure this out after current weather
// function displayFiveDayForecast(){

//     if(repos.length === 0){
//         fivedayContainerEl.textContent = "No repositories found";
//         return;
//     };

//     for(var i=0; i<repos.length; i++){
//         var date = repos[i].list.dt_text;
//         var icon = repos[i].weather.icon;
//         var temperature = "Temp: " + repos[i].main.temp;
//         var wind = "Wind: " + repos[i].wind.speed + "MPH";
//         var humidity = "Humidity: " + repos[i].main.humidity + "%";

//         var dateEl = document.createElement('h2');
//         var iconEl = document.createElement('p');
//         var temperatureEl = document.createElement('p');
//         var windEl = document.createElement('p');
//         var humidityEl = document.createElement('p');
//         var uvIndexEl = document.createElement('p');

//         fivedayContainerEl.appendChild(dateEl);
//         fivedayContainerEl.appendChild(temperatureEl);
//         fivedayContainerEl.appendChild(windEl);
//         fivedayContainerEl.appendChild(humidityEl);
//         fivedayContainerEl.appendChild(uvIndexEl);
//     };

// };

//Populate the search history city buttons through page reload
window.addEventListener("load", function(){
    var citySubmitReload = JSON.parse(localStorage.getItem("cities")) || [];

    for(var i=0; i<citySubmitReload.length; i++){
        var cityHistoryEl = document.createElement("button");
        cityHistoryEl.textContent = citySubmitReload[i];
        cityHistoryEl.classList = "btn btn-primary search-history";
        searchHistoryContainerEl.appendChild(cityHistoryEl);
    };
})

//Clear search history button
var clearHistoryEl = document.querySelector("#clear-history");

clearHistoryEl.addEventListener("click", function(event){
    event.preventDefault();
    localStorage.clear();
    window.location.reload();
});

//API call for current weather (https://openweathermap.org/current)
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

//API call for 5 day forecast (https://openweathermap.org/forecast5)
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

//API call for lat long of city name 
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//data.lat, data.lon

//my API key: 27d064bc9585ece2266de44bda36203b
}