// checking if the user input is valid.
function cityNameInputHandler(e) {
  // prevent submit default behavior
  e.preventDefault();

  const userCityName = $("#cityName").val().trim();
  // conditional to check if the input is valid or not.
  if (userCityName) {
    console.log(userCityName);
    savedSearch(userCityName);
    instantDisplay(userCityName);
    currentDayWeather(userCityName);

    // clear out the input value after user submit
    $("#cityName").val("");
  } else if (userCityName === null) {
    alert("Please enter a valid city name");
  } else {
    alert("Please enter a valid city name");
  }
}

$("#cityForm").submit(cityNameInputHandler);

// search history to localStorage
let citySearchArry = JSON.parse(localStorage.getItem("city")) || [];

function savedSearch(searchCity) {
  // variable initializing the local storage to receive obj
  const loc = "location"; //placeholder for right now only
  const cityObj = {
    city: searchCity,
    location: loc,
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
}
displayHistoricalSearch();

/* couldn't figure out how to display the search city instantly
when user issue input value, so creating function to add the value to the end of
ul element */
function instantDisplay(inputValue) {
  $(".list-wrapper").append("<li class='history-list p-2'>" + inputValue + "</li>");
}

// fetch weather API -- need more work..don't really know how to do this one.
function currentDayWeather(city) {
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=330db953764b679cb99918f065ab10a8";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => alert("That's not a city. Please try again"));
}
