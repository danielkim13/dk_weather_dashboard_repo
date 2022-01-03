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
