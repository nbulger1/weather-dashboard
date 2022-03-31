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
var fivedayCardEl = document.querySelectorAll(".fiveday-card");

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

        var date = moment().format("MM/DD/YYYY");
        var cityHeaderEl = document.createElement("h2");
        cityHeaderEl.textContent = cityEntryValueEl + "-" + date;
        todayCardContainerEl.appendChild(cityHeaderEl);
    } else {
        alert("That city is already in your recents!");
    };

    localStorage.setItem("cities", JSON.stringify(citySubmit));

    //clear out the main text content

    console.log(cityEntryValueEl);
    var post;
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityEntryValueEl + "&limit=5&appid=27d064bc9585ece2266de44bda36203b").then(function (response) {
        if(response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function(data) {
        post = data;
        console.log(post);
        var lat = post[0].lat;
        var long = post[0].lon;
        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=27d064bc9585ece2266de44bda36203b");
    }).then(function (response) {
        if(response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function (userData) {
        console.log(post, userData);
        displayCurrentWeather(userData);
        displayFiveDayForecast(userData);
    }).catch(function(error) {
        console.warn(error);
    })

    cityEntryEl.value = "";

};

submitEl.addEventListener('click', submitButtonHandler);

//Make the history buttons display the weather
// var searchHistoryEl = document.querySelectorAll("search-history");
// for(i=0; i<searchHistoryEl.length; i++){
//     searchHistoryEl[i].addEventListener('click', displayCurrentWeather(userData))
//     searchHistoryEl[i].addEventListener('click', displayFiveDayForecast(userData))
// }

function displayCurrentWeather(repos) {

    if(repos.length === 0){
        todayCardContainerEl.textContent = "No repositories found";
        return;
    };
    // var date = repos.dt;


    var icon = repos.current.weather[0].icon;
    //convert temperature from Kelvin to Farenheit
    var temperature = "Temp: " + (((repos.current.temp-273.15)*1.8)+32).toFixed(1) + " \xB0F";
    var wind = "Wind: " + repos.current.wind_speed + " MPH";
    var humidity = "Humidity: " + repos.current.humidity + "%";
    var uvIndex = repos.current.uvi;

    var iconEl = document.createElement('img');
    var temperatureEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvIndexTextEl = document.createElement('p');
    var uvIndexEl = document.createElement('span');

    if(uvIndex <= 2){
        uvIndexEl.setAttribute("class", "uv-good");
        uvIndexEl.setAttribute("class", "uv-good");
    } else if(uvIndex > 2 & uvIndex <=5) {
        uvIndexEl.setAttribute("class", "uv-okay");
    } else {
        uvIndexEl.setAttribute("class", "uv-bad");
    }

    iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
    temperatureEl.textContent = temperature;
    windEl.textContent = wind;
    humidityEl.textContent = humidity;
    uvIndexEl.textContent = uvIndex;
    uvIndexTextEl.textContent = "UV Index: ";

    todayCardContainerEl.appendChild(iconEl);
    todayCardContainerEl.appendChild(temperatureEl);
    todayCardContainerEl.appendChild(windEl);
    todayCardContainerEl.appendChild(humidityEl);
    uvIndexTextEl.appendChild(uvIndexEl);
    todayCardContainerEl.appendChild(uvIndexTextEl);
};

function displayFiveDayForecast(repos){

    if(repos.length === 0){
        fivedayContainerEl.textContent = "No repositories found";
        return;
    };

    for(var i=1; i<6; i++){
        var date = moment().add(i, "d").format("MM/DD/YYYY");

        var icon = repos.daily[i].weather[0].icon;
        //convert temperature from Kelvin to Farenheit
        var temperature = "Temp: " + (((repos.daily[i].temp.day-273.15)*1.8)+32).toFixed(1) + " \xB0F";
        var wind = "Wind: " + repos.daily[i].wind_speed + " MPH";
        var humidity = "Humidity: " + repos.daily[i].humidity + "%";

        var dateEl = document.createElement('p');
        var iconEl = document.createElement('img');
        var temperatureEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');

        dateEl.textContent = date;
        iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
        temperatureEl.textContent = temperature;
        windEl.textContent = wind;
        humidityEl.textContent = humidity;

        fivedayCardEl[i-1].appendChild(dateEl);
        fivedayCardEl[i-1].appendChild(iconEl);
        fivedayCardEl[i-1].appendChild(temperatureEl);
        fivedayCardEl[i-1].appendChild(windEl);
        fivedayCardEl[i-1].appendChild(humidityEl);
    }

};

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
