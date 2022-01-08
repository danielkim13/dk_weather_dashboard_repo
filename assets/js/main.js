// checking if the user input is valid.
function cityNameInputHandler(e) {
  // prevent submit default behavior
  e.preventDefault();

  const userCityName = $("#cityName").val().trim();
  // conditional to check if the input is valid or not.
  if (isNaN(userCityName)) {
    // console.log(typeof userCityName);
    // savedSearch(userCityName);
    // instantDisplay(userCityName);
    currentDayWeather(userCityName);
    // clear out the input value after user submit
    $("#cityName").val("");
  } else if (userCityName === null) {
    alert("Please enter a valid city name");
  } else {
    alert("Please enter a valid city name"); // !need to figure out how to check symbols.
    $("#cityName").val("");
  }
}

$("#cityForm").submit(cityNameInputHandler);

// variable initializing the local storage to receive obj
let citySearchArry = JSON.parse(localStorage.getItem("city")) || [];

function savedSearch(searchCity) {
  const cityObj = {
    city: searchCity,
  };

  citySearchArry.push(cityObj);
  localStorage.setItem("city", JSON.stringify(citySearchArry));
}

// displaying Historical search and when clicked it, the city name gets push to input.
function displayHistoricalSearch() {
  JSON.parse(localStorage.getItem("city")) || [];
  $(".history-wrapper").append("<ul class='list-wrapper p-1 m-0'>");

  for (let i = 0; i < citySearchArry.length; i++) {
    $(".list-wrapper").append("<li class='history-list p-2'>" + citySearchArry[i].city);
  }
  // make the search history clickable
  $(document).ready(function () {
    $(".history-list").click(function (event) {
      const cityHistory = event.target.textContent;
      // console.log(cityHistory);
      executeHistory(cityHistory); //! param is data not the city.. hmmm
    });
  });
}
displayHistoricalSearch();

/* couldn't figure out how to display the search city instantly
when user issue input value, so creating function to add the value to the end of
ul element */
// need to make this one event.target click as well
function instantDisplay(inputValue) {
  $(".list-wrapper").append("<p class='history-list p-2'>" + inputValue);
  $(".history-list").click(() => {
    executeHistory(inputValue); // ! param is data not the city...
  });
}

// intermediate fetch for history search line. because I'm calling the savedsearch and instantdiplay functions after the response comes back. had to write this bridge function.
function executeHistory(cityName) {
  const appID = "330db953764b679cb99918f065ab10a8";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + appID;

  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          currentForecast(data);
        });
      } else {
        alert("Error: seems like the history search isn't working properly");
      }
    })
    .catch((error) => {
      alert("Unable to connect to the API");
    });
}

// fetch weather API -- query for city name and imperial metrics
function currentDayWeather(city) {
  // bug fix 1.5.22 clearing children nodes
  // $(".current-weather").empty();
  // $(".current-weather-data").empty();

  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=330db953764b679cb99918f065ab10a8";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          currentForecast(data);
          // console.log(data);
          savedSearch(city);
          instantDisplay(city);
        });
      } else {
        alert("Error: check the city name and try again");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to open weather map");
    });
}

// displaying current forecast weather information
function currentForecast(today) {
  const todayIcon = today.weather[0].icon;
  const iconUrl = "http://openweathermap.org/img/wn/" + todayIcon + "@2x.png";
  const cityDisplay = today.name;
  const uTime = today.dt;
  const conversionTime = new Date(uTime * 1000);
  const currentDate = conversionTime.toLocaleDateString("en-US");
  const currentTemp = today.main.temp;
  const currentWind = today.wind.speed;
  const currentHum = today.main.humidity;

  $(".current-weather").empty();
  $(".current-weather-data").empty();

  $(".current-weather-wrapper").addClass("border border-dark");
  $(".current-weather").append("<img class='d-inline-block' src=" + iconUrl + ">");
  $(".current-weather").append("<h3 class='d-inline-block align-middle'>" + cityDisplay + " | (" + currentDate + ")");
  $(".current-weather-data").append("<p class='p-2'>Temperature:  " + currentTemp + " &#176F");
  $(".current-weather-data").append("<p class='p-2'>Wind:  " + currentWind + " MPH");
  $(".current-weather-data").append("<p class='p-2'>Humidity:  " + currentHum + " %");

  // UV Index. it is not part of data array so i have to do another fetch to get it
  const lat = today.coord.lat;
  const lon = today.coord.lon;

  // calling the 5-day forecast since lat/lon is required. city search is not a part of free service the api provides... frustrating!!
  fiveDayForecast(lat, lon);

  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,minutely,hourly,daily,alerts&appid=330db953764b679cb99918f065ab10a8")
    .then((response) => response.json())
    .then((uvdata) => {
      const uvIndex = uvdata.current.uvi;
      // console.log(uvIndex);
      $(".current-weather-data").append("<p class='uv p-2'>UV Index:  <span>" + uvIndex);
      if (uvIndex < 3) {
        $(".uv span").attr("class", "low");
      } else if (uvIndex >= 3 && uvIndex < 6) {
        $(".uv span").attr("class", "moderate");
      } else if (uvIndex >= 6 && uvIndex < 8) {
        $(".uv span").attr("class", "high");
      } else if (uvIndex >= 8 && uvIndex < 11) {
        $(".uv span").attr("class", "very-high");
      } else {
        $(".uv span").attr("class", "extreme");
      }
    })
    .catch((err) => alert("not working"));
}

// 5-day forecast dynamically displays info.
function fiveDayForecast(lat, lon) {
  $(".forecast-title").text("5-Day Forecast:");
  $(".future-forecast-wrapper").last().addClass("border border-dark");

  // with the free subscription I'm limited.. can't fetch 5 days forecast.
  const appId = "876c146eea7b7cf6b54b8e5e52a182c3";
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + appId)
    .then((response) => response.json())
    .then((forecast) => {
      // console.log(forecast);
      forecastDataHandle(forecast);
    })
    .catch((err) => alert("Five Day Forecast Error"));
}

function forecastDataHandle(forecast) {
  const forecastData = forecast.daily;

  // clear out the child nodes
  $("#dayOne").children().remove();
  $("#dayTwo").children().remove();
  $("#dayThree").children().remove();
  $("#dayFour").children().remove();
  $("#dayFive").children().remove();

  // couldn't figure out how to do this using for loop method.
  // DAY ONE
  $("#dayOne").last().addClass("border border-dark bg-secondary text-light");
  $("#dayOne").append("<p>" + new Date(forecastData[1].dt * 1000).toLocaleDateString("en-US"));
  $("#dayOne").append("<img src='http://openweathermap.org/img/wn/" + forecastData[1].weather[0].icon + ".png'>");
  $("#dayOne").append("<p>Temp: " + forecastData[1].temp.day + " &#176F");
  $("#dayOne").append("<p>Wind: " + forecastData[1].wind_speed + " MPH");
  $("#dayOne").append("<p>Hum: " + forecastData[1].humidity + "%");

  // DAY TWO
  $("#dayTwo").last().addClass("border border-dark bg-secondary text-light");
  $("#dayTwo").append("<p>" + new Date(forecastData[2].dt * 1000).toLocaleDateString("en-US"));
  $("#dayTwo").append("<img src='http://openweathermap.org/img/wn/" + forecastData[2].weather[0].icon + ".png'>");
  $("#dayTwo").append("<p>Temp: " + forecastData[2].temp.day + " &#176F");
  $("#dayTwo").append("<p>Wind: " + forecastData[2].wind_speed + " MPH");
  $("#dayTwo").append("<p>Hum: " + forecastData[2].humidity + "%");

  // DAY THREE
  $("#dayThree").last().addClass("border border-dark bg-secondary text-light");
  $("#dayThree").append("<p>" + new Date(forecastData[3].dt * 1000).toLocaleDateString("en-US"));
  $("#dayThree").append("<img src='http://openweathermap.org/img/wn/" + forecastData[3].weather[0].icon + ".png'>");
  $("#dayThree").append("<p>Temp: " + forecastData[3].temp.day + " &#176F");
  $("#dayThree").append("<p>Wind: " + forecastData[3].wind_speed + " MPH");
  $("#dayThree").append("<p>Hum: " + forecastData[3].humidity + "%");

  // DAY FOUR
  $("#dayFour").last().addClass("border border-dark bg-secondary text-light");
  $("#dayFour").append("<p>" + new Date(forecastData[4].dt * 1000).toLocaleDateString("en-US"));
  $("#dayFour").append("<img src='http://openweathermap.org/img/wn/" + forecastData[4].weather[0].icon + ".png'>");
  $("#dayFour").append("<p>Temp: " + forecastData[4].temp.day + " &#176F");
  $("#dayFour").append("<p>Wind: " + forecastData[4].wind_speed + " MPH");
  $("#dayFour").append("<p>Hum: " + forecastData[4].humidity + "%");

  // DAY FIVE
  $("#dayFive").last().addClass("border border-dark bg-secondary text-light");
  $("#dayFive").append("<p>" + new Date(forecastData[5].dt * 1000).toLocaleDateString("en-US"));
  $("#dayFive").append("<img src='http://openweathermap.org/img/wn/" + forecastData[5].weather[0].icon + ".png'>");
  $("#dayFive").append("<p>Temp: " + forecastData[5].temp.day + " &#176F");
  $("#dayFive").append("<p>Wind: " + forecastData[5].wind_speed + " MPH");
  $("#dayFive").append("<p>Hum: " + forecastData[5].humidity + "%");
}

/* Bugs
1. city duplicate in localStorage and search history column.
2. input value need to be checked for any symbols.
*/
