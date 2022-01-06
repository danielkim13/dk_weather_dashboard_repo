// checking if the user input is valid.
function cityNameInputHandler(e) {
  // prevent submit default behavior
  e.preventDefault();

  const userCityName = $("#cityName").val().trim();
  // conditional to check if the input is valid or not.
  if (isNaN(userCityName)) {
    console.log(typeof userCityName);
    savedSearch(userCityName);
    instantDisplay(userCityName);
    currentDayWeather(userCityName);
    fiveDayForecast(userCityName);

    // clear out the input value after user submit
    $("#cityName").val("");
  } else if (userCityName === null) {
    alert("Please enter a valid city name");
  } else {
    alert("Please enter a valid city name"); // !need to figure out how to check symbols.
  }
}

$("#cityForm").submit(cityNameInputHandler);

// search history to localStorage
let citySearchArry = JSON.parse(localStorage.getItem("city")) || [];

function savedSearch(searchCity) {
  // variable initializing the local storage to receive obj
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
      currentDayWeather(cityHistory);
      fiveDayForecast(cityHistory);
    });
  });
}
displayHistoricalSearch();

/* couldn't figure out how to display the search city instantly
when user issue input value, so creating function to add the value to the end of
ul element */
// need to make this one event.target click as well
function instantDisplay(inputValue) {
  $(".list-wrapper").append("<li class='history-list p-2'>" + inputValue + "</li>");
  $(".history-list").click(() => {
    currentDayWeather(inputValue);
    fiveDayForecast(inputValue);
  });
}

// fetch weather API -- query for city name and imperial metrics
function currentDayWeather(city) {
  // bug fix 1.5.22 clearing children nodes
  $(".current-weather").children().remove();
  $(".current-weather-data").children().remove();

  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=330db953764b679cb99918f065ab10a8";

  fetch(apiUrl)
    .then(function (response) {
      response.json().then(function (data) {
        // console.log(data);
        currentForecast(data);
      });
    })
    .catch(function (err) {
      console.log("no good", err);
      alert("That's not a city. What were you thinking?");
    });
}

// displaying current forecast weather information
function currentForecast(today) {
  const todayIcon = today.weather[0].icon;
  const iconUrl = "http://openweathermap.org/img/wn/" + todayIcon + "@2x.png";
  const cityDisplay = today.name;
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentTemp = today.main.temp;
  const currentWind = today.wind.speed;
  const currentHum = today.main.humidity;

  $(".current-weather-wrapper").addClass("border border-dark");
  $(".current-weather").append("<img class='d-inline-block' src=" + iconUrl + ">");
  $(".current-weather").append("<h3 class='d-inline-block align-middle'>" + cityDisplay + " | (" + currentDate + ")");
  $(".current-weather-data").append("<p class='p-2'>Temperature:  " + currentTemp + " &#176F");
  $(".current-weather-data").append("<p class='p-2'>Wind:  " + currentWind + " MPH");
  $(".current-weather-data").append("<p class='p-2'>Humidity:  " + currentHum + " %");

  // UV Index. it is not part of data array so i have to do another fetch to get it
  const lat = today.coord.lat;
  const lon = today.coord.lon;

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
function fiveDayForecast(cityName) {
  $(".future-forecast-wrapper").text("5-Day Forecast:");
  $(".future-forecast-wrapper").attr("class", "border border-dark");

  // with the free subscription I'm limited.. can't fetch 5 days forecast.
  fetch("https://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName + "&cnt=5&units=imperial&appid=876c146eea7b7cf6b54b8e5e52a182c3")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => alert("not working"));
}
