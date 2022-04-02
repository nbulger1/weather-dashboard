//Event handler for submit button
var submitEl = document.querySelector(".submit");
var searchHistoryContainerEl = document.querySelector(".search-history-container");
var cityEntryEl = document.querySelector(".city-entry");
var todayCardContainerEl = document.querySelector(".today-card-container");
var todayCardHeaderEl = document.querySelector(".today-card-header");
var todayCardContentEl = document.querySelector(".today-card-content");
var fivedayCardEl = document.querySelectorAll(".fiveday-card");
var searchHistoryContainerEl = document.querySelector(".search-history-container");


//function to handle the submit button ?
function submitButtonHandler() {
    //pull any cities in local storage and store them in an array
    var citySubmit = JSON.parse(localStorage.getItem("cities")) || [];
    var cityEntryValueEl = document.querySelector(".city-entry").value.trim();

    //Capitalize the first letter of the city if they weren't capital in the entry
    cityEntryValueEl = cityEntryValueEl.split(" ");
    for (let i = 0; i < cityEntryValueEl.length; i++) {
        cityEntryValueEl[i] = cityEntryValueEl[i][0].toUpperCase() + cityEntryValueEl[i].substr(1);
    }
    cityEntryValueEl = cityEntryValueEl.join(' ');

    //If the current citySubmit array doesn't contain the city entered then push it to the array and add a search history button
    if(!citySubmit.includes(cityEntryValueEl)){
        citySubmit.push(cityEntryValueEl);
        var cityHistoryEl = document.createElement("button");
        cityHistoryEl.textContent = cityEntryValueEl;
        cityHistoryEl.classList = "btn search-history";
        //set a data-attribute equal to the city name to be used later for search history button function
        cityHistoryEl.setAttribute("data-city", cityEntryValueEl);
        searchHistoryContainerEl.appendChild(cityHistoryEl);
    } else {
        //Let the user know there is already a history button for a city if it was previously searched
        alert("That city is already in your recents!");
    };

    //Store the new array with any additional cities in local storage
    localStorage.setItem("cities", JSON.stringify(citySubmit));

    //Run the header creation function to create the header at the top of the current weather section
    createMainHeader(cityEntryValueEl);

    //Run the get weather function that calls the API
    getWeather(cityEntryValueEl);

};

// Make the history buttons display the weather - apply an event listener to the search history button container
searchHistoryContainerEl.addEventListener("click", function(event){

    //Pull the data attribute when the history button is clicked using event target to find the mouse click within the container
    var historyAttribute = event.target.getAttribute("data-city");

    //clear out any remaining header
    todayCardHeaderEl.innerHTML = "";
    //grab the current date using moment
    var date = moment().format("MM/DD/YYYY");
    var cityHeaderEl = document.createElement("h2");
    cityHeaderEl.textContent = historyAttribute + "-" + date;
    todayCardHeaderEl.appendChild(cityHeaderEl);

    //run the get weather function that calls the API and runs the display functions using the data attribute from the history button
    getWeather(historyAttribute);
});

//getWeather function to call each API - function can pass a city name
function getWeather(cityEntryValueEl) {
    var post;
    //first gather the latitude and longitude of the city name entered using the geocoding API
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityEntryValueEl + "&limit=5&appid=27d064bc9585ece2266de44bda36203b").then(function (response) {
        if(response.ok) {
            return response.json();
        } else {
            alert("City not found - please check spelling");
            return Promise.reject(response);
        }
    }).then(function(data) {
        post = data;
        console.log(post);
        //Create variable for the lat and long that can be passed through the next API call
        var lat = post[0].lat;
        var long = post[0].lon;
        //force the first API call to finish before the second by using a return to API call
        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=27d064bc9585ece2266de44bda36203b");
    }).then(function (response) {
        if(response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function (userData) {
        console.log(post, userData);
        //If all the data is good then run the display functions for the current weather and the 5 day forecast
        displayCurrentWeather(userData);
        displayFiveDayForecast(userData);
        
    }).catch(function(error) {
        console.warn(error);
    })
}

//Apply an event listener to the submit button that runs the handler function
submitEl.addEventListener('click', submitButtonHandler);

//Create the main header in the current weather box - also passes through a city name
function createMainHeader(cityEntryValueEl){
    //clear out any current header
    todayCardHeaderEl.innerHTML = "";
    //Pull the entry from the input field
    var cityEntryValueEl = document.querySelector(".city-entry").value.trim();

    //Capitalize the first letter if it wasn't capital
    cityEntryValueEl = cityEntryValueEl.split(" ");
    for (let i = 0; i < cityEntryValueEl.length; i++) {
        cityEntryValueEl[i] = cityEntryValueEl[i][0].toUpperCase() + cityEntryValueEl[i].substr(1);
    }
    cityEntryValueEl = cityEntryValueEl.join(' ');

    //pull the current date from moment
    var date = moment().format("MM/DD/YYYY");
    var cityHeaderEl = document.createElement("h2");
    cityHeaderEl.textContent = cityEntryValueEl + "-" + date;
    todayCardHeaderEl.appendChild(cityHeaderEl);
    //empty the input field
    cityEntryEl.value = "";
}


//function to display the current weather using DOM manipulation
function displayCurrentWeather(repos) {

    //Clear out current day content
    todayCardContentEl.innerHTML = "";

    //if no repos were found then display that no repos were found and stop the function
    if(repos.length === 0){
        todayCardContainerEl.textContent = "No repositories found - please check your city name";
        return;
    };

    //pull the necessary information from the repository in the current weather section
    var icon = repos.current.weather[0].icon;
    //convert temperature from Kelvin to Farenheit
    var temperature = "Temp: " + (((repos.current.temp-273.15)*1.8)+32).toFixed(1) + " \xB0F";
    var wind = "Wind: " + repos.current.wind_speed + " MPH";
    var humidity = "Humidity: " + repos.current.humidity + "%";
    var uvIndex = repos.current.uvi;

    //create the necessary HTML elements to hold the information pulled
    var iconEl = document.createElement('img');
    var temperatureEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvIndexTextEl = document.createElement('p');
    //make a uvindex span so it can be color-coded based on severity
    var uvIndexEl = document.createElement('span');

    //Conditional to change the class of the uv-index based on severity
    if(uvIndex <= 2){
        uvIndexEl.setAttribute("class", "uv-good");
        uvIndexEl.setAttribute("class", "uv-good");
    } else if(uvIndex > 2 & uvIndex <=5) {
        uvIndexEl.setAttribute("class", "uv-okay");
    } else {
        uvIndexEl.setAttribute("class", "uv-bad");
    }

    //apply the text content to each of the new HTML elements
    iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
    temperatureEl.textContent = temperature;
    windEl.textContent = wind;
    humidityEl.textContent = humidity;
    uvIndexEl.textContent = uvIndex;
    uvIndexTextEl.textContent = "UV Index: ";

    //Changing the today card background image based on weather description for main weather categories
    if(repos.current.weather[0].main == "Clouds"){
        todayCardContainerEl.style.backgroundImage = "url('./assets/images/clouds.jpg')";
        todayCardContainerEl.style.color = "black";
    } else if(repos.current.weather[0].main == "Clear"){
        todayCardContainerEl.style.backgroundImage = "url('./assets/images/sun.png')";
        todayCardContainerEl.style.color = "black";
    } else if(repos.current.weather[0].main == "Snow"){
        todayCardContainerEl.style.backgroundImage = "url('./assets/images/snow.jpg')";
        todayCardContainerEl.style.color = "black";
    } else if(repos.current.weather[0].main == "Rain"){
        todayCardContainerEl.style.backgroundImage = "url('./assets/images/rain.jpg')";
        todayCardContainerEl.style.color = "white";
    } else {
        todayCardContainerEl.style.backgroundColor = "lightgrey";
        todayCardContainerEl.style.color = "black";
    };

    //Append the HTML elements into the card content container - does not include header created in previous function
    todayCardContentEl.appendChild(iconEl);
    todayCardContentEl.appendChild(temperatureEl);
    todayCardContentEl.appendChild(windEl);
    todayCardContentEl.appendChild(humidityEl);
    uvIndexTextEl.appendChild(uvIndexEl);
    todayCardContentEl.appendChild(uvIndexTextEl);
};

//function to display the fivedayforecast 
function displayFiveDayForecast(repos){

    //Clear out five day forecast cards
    for(var i=0; i<fivedayCardEl.length; i++){
        fivedayCardEl[i].innerHTML = "";
    };

    //if there are no repos found then display text to reflect
    if(repos.length === 0){
        fivedayContainerEl.textContent = "No repositories found - Please check your city name";
        return;
    };

    //Starting at index 1 within the daily weather portion of the repository because index 0 is the current weather which is already displayed above
    //Run through index 6 to get 5 days of weather
    for(var i=1; i<6; i++){
        //create the date by adding "i" number of days to the current day using moment
        var date = moment().add(i, "d").format("MM/DD/YYYY");

        //Gather all the necessary information for the forecast cards
        var icon = repos.daily[i].weather[0].icon;
        //convert temperature from Kelvin to Farenheit
        var temperature = "Temp: " + (((repos.daily[i].temp.day-273.15)*1.8)+32).toFixed(1) + " \xB0F";
        var wind = "Wind: " + repos.daily[i].wind_speed + " MPH";
        var humidity = "Humidity: " + repos.daily[i].humidity + "%";

        //Create the child elements
        var dateEl = document.createElement('p');
        var iconEl = document.createElement('img');
        var temperatureEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');

        //Apply the text content using the gathered information and child elements
        dateEl.textContent = date;
        iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
        temperatureEl.textContent = temperature;
        windEl.textContent = wind;
        humidityEl.textContent = humidity;

        //Append the associated child with the correct fivedayCard by subtracting 1 from the index because the fivedayCard queryselectorAll starts at 0
        fivedayCardEl[i-1].appendChild(dateEl);
        fivedayCardEl[i-1].appendChild(iconEl);
        fivedayCardEl[i-1].appendChild(temperatureEl);
        fivedayCardEl[i-1].appendChild(windEl);
        fivedayCardEl[i-1].appendChild(humidityEl);
    }

};

//Populate the search history city buttons through page reload
window.addEventListener("load", function(){
    //Pull the local storage cities and store them as an array
    var citySubmitReload = JSON.parse(localStorage.getItem("cities")) || [];

    //Go through each of the cities in the array and create a button with the city as a data attribute
    for(var i=0; i<citySubmitReload.length; i++){
        var cityHistoryEl = document.createElement("button");
        cityHistoryEl.textContent = citySubmitReload[i];
        cityHistoryEl.classList = "btn btn-primary search-history";
        cityHistoryEl.setAttribute("data-city", citySubmitReload[i]);
        searchHistoryContainerEl.appendChild(cityHistoryEl);
    };
})

//Clear search history button event handler
var clearHistoryEl = document.querySelector("#clear-history");

//Add event listener to the clear history element that clears out local storage and reloads the page
clearHistoryEl.addEventListener("click", function(event){
    event.preventDefault();
    localStorage.clear();
    window.location.reload();
});

