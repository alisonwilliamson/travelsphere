$("#search-btn").on("click", function () {
    var city = $("#search-input").val().toUpperCase().trim();
    callTripAdvisor(city);
  });
  
  //when user clicks on "X"" icon, it clears ALL. 
  $("#clear-btn").on("click", function()  {
    //Reresh page, then clear ALL
    location.reload(true);
    localStorage.clear();
  });
  
  // initialize sidenav using materialize js
  $(document).ready(function () {
    $(".sidenav").sidenav();
  });
  
  // initialize slider using materialize js
  const slider = document.querySelector(".slider");
  M.Slider.init(slider, {
    indicators: false,
    height: 500,
  });
  
  // gets cities from local storage
  var getSeachedCitiesFromLS = JSON.parse(
    localStorage.getItem("searched-cities")
  );
  if (getSeachedCitiesFromLS !== null) {
    getSeachedCitiesFromLS.forEach(function (city) {
      city.toUpperCase();
    });
    listOfSearchedCities = getSeachedCitiesFromLS;
  }
  
  // search button function that listens for click event
  $("#search-btn").on("click", function () {
    event.preventDefault();
    clearDisplayedWeatherInfo();
    resetGlobalVariables();
  
    var cityName = $("input").val().toUpperCase().trim();
    $("#search-input").val("");
    searchCity(cityName);
  
    // saves to local storage
    if (cityName !== "" && listOfSearchedCities[0] !== cityName) {
      listOfSearchedCities.unshift(cityName);
      localStorage.setItem(
        "searched-cities",
        JSON.stringify(listOfSearchedCities)
      );
      if (listOfSearchedCities.length === 1) {
        $("#searched-cities-card").removeClass("hide");
      }
      $("#searched-cities-list")
        .prepend(`<a href="#" class="list-group-item" style="text-decoration: none; color: black;">
        <li>${cityName}</li>
        </a>`);
    }
  });
  
  // clears weather results when called
  function clearDisplayedWeatherInfo() {
    $("#current-weather-conditions").empty();
    $("#card-deck-title").remove();
    $(".card-deck").empty();
  }
  
  // sets variables to nothing so after weather is displayed they reset
  function resetGlobalVariables() {
    city = "";
    currentDate = "";
    tempF = "";
    humidityValue = "";
    latitude = "";
    longitude = "";
    minTempK = "";
    maxTempK = "";
    minTempF = "";
    maxTempF = "";
    dayhumidity = "";
    currentWeatherIconCode = "";
    currentWeatherIconUrl = "";
    iconcode = "";
    iconurl = "";
    country = "";
  }
  
  // set variables
  var APIKey = "166a433c57516f51dfab1f7edaed8413";
  var city = "";
  var currentDate = "";
  var tempF = "";
  var humidityValue = "";
  var latitude = "";
  var longitude = "";
  var minTempK = "";
  var maxTempK = "";
  var minTempF = "";
  var maxTempF = "";
  var dayhumidity = "";
  var currentWeatherIconCode = "";
  var currentWeatherIconUrl = "";
  var iconcode = "";
  var iconurl = "";
  var country = "";
  var listOfSearchedCities = [];
  
  function searchCity(cityName) {
    // build URL to query the database
    var queryURL="https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var result = response;
      city = result.name.trim();
      currentDate = moment.unix(result.dt).format("l");
  
      var tempK = result.main.temp;
      tempF = ((tempK - 273.15) * 1.8 + 32).toFixed(1);
      humidityValue = result.main.humidity;
      
      var latitude = result.coord.lat;
      var longitude = result.coord.lon;
      var uvIndexQueryUrl ="https://api.openweathermap.org/data/2.5/uvi?&appid="+APIKey+"&lat="+latitude+"&lon="+longitude;
  
      $.ajax({
        url: uvIndexQueryUrl,
        method: "GET",
      }).then(function (response) {
        var fiveDayQueryUrl="https://api.openweathermap.org/data/2.5/forecast/daily?q=" +city+"&appid="+APIKey+"&cnt=5";
        $.ajax({
          url: fiveDayQueryUrl,
          method: "GET",
        }).then(function (response) {
          var fiveDayForecast = response.list;
          for (var i = 0; i < 5; i++) {
            iconcode = fiveDayForecast[i].weather[0].icon;
            iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            dateValue = moment.unix(fiveDayForecast[i].dt).format("l");
            minTempK = fiveDayForecast[i].temp.min;
            minTempF = ((minTempK - 273.15) * 1.8 + 32).toFixed(1);
            maxTempF = (
              (fiveDayForecast[i].temp.max - 273.15) * 1.8 +
              32
            ).toFixed(1);
            dayhumidity = fiveDayForecast[i].humidity;
            displayDayForeCast();
          }
        });
      });
    });
  }
  
  // creates cards for the weather to be displayed
  function displayDayForeCast() {
    $(".day-results").html("<h4 class='font-weight-bold teal-text'>5-Day Forecast</h4>").append("<div class='row'>");
    
    var imgEl = $("<img>").attr("src", iconurl);
    var cardEl = $("<div class='card'>").addClass("pl-1 bg-light text-dark center");
    var cardBlockDiv = $("<div>").attr("class", "card-block");
    var cardTitleDiv = $("<div>").attr("class", "card-block");
    var cardTitleHeader = $("<h6>").text(dateValue).addClass("pt-2").css("font-size", "2rem");
    var cardTextDiv = $("<div>").attr("class", "card-text");
    var minTempEl = $("<p>").text("Min Temp: " + minTempF + " ºF").css("font-size", "1.25rem");
    var maxTempEl = $("<p>").text("Max Temp: " + maxTempF + " ºF").css("font-size", "1.25rem");
    var humidityEl = $("<p>").text("Humidity: " + dayhumidity + "%").css("font-size", "1.25rem");
    cardTextDiv.append(imgEl);
    cardTextDiv.append(minTempEl);
    cardTextDiv.append(maxTempEl);
    cardTextDiv.append(humidityEl);
    cardTitleDiv.append(cardTitleHeader);
    cardBlockDiv.append(cardTitleDiv);
    cardBlockDiv.append(cardTextDiv);
    cardEl.append(cardBlockDiv);
    $(".card-deck").append(cardEl);
  }
  
  
  // gets data from TripAdvisor API
  function callTripAdvisor(city) {
    var settings = {
      async: true,
      crossDomain: true,
      url:
        "https://tripadvisor1.p.rapidapi.com/locations/search?location_id=1&limit=15&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query=" +
        city,
      method: "GET",
      headers: {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "c86351f800msh66a90fb0ca87ca0p192d84jsnb389b451c06a",
      },
    };
  
    $.ajax(settings).then(function (response) {
      displayTripAdivsor(response);
    });
  };
  
  // displays data from Trip
  function displayTripAdivsor(response) {
    for (i = 0; i < response.data.length; i++) {
        // results header appears
        $(".results-header").html("<h4 class='font-weight-bold teal-text'>Hotels and Activities</h4>").append("<div class='row'>");
        // append TripAdvisor info onto cards
        var cardDivBlock = $("<div>").addClass("col-4 d-flex ");
        $("#trip2").append(cardDivBlock);
        var cardDiv = $("<div>").addClass("card");
        cardDivBlock.append(cardDiv);
        var cardImage = $("<div>").addClass("card-image d-flex").append("<img src =" + response.data[i].result_object.photo.images.original.url + ">");
        cardDiv.append(cardImage);
        var cardBody = $("<div>").addClass("card-body");
        cardDiv.append(cardBody);
        var cardTitle = $("<div>").addClass("card-title").text(response.data[i].result_object.name);
        cardBody.append(cardTitle);
        var cardText = $("<div>").addClass("card-text").text(response.data[i].result_object.category.name);
        cardBody.append(cardText);
        var cardLink = $("<div>").addClass("card-action center-align").append( "<a target='_blank' href='https://www.tripadvisor.com/Hotel_Review-g35805-d" +  response.data[i].result_object.location_id + "-Reviews-" + response.data[i].result_object.name + "-" + response.data[i].result_object.location_string +"'>"+" Reviews </a>");
        cardDiv.append(cardLink);
    }
  };
  
  // initialize kayak widget
  KAYAK.embed({
    container: document.getElementById("kayakSearchWidgetContainer"),
    hostname: "www.kayak.com",
    autoPosition: true,
    defaultProduct: "flights",
    enabledProducts: ["flights"],
    startDate: "2018-10-02",
    endDate: "2018-10-28",
    origin: "New York, NY",
    destination: "Boston, MA",
    ssl: true,
    affiliateId: "acme_corp",
    isInternalLoad: false,
    lc: "en",
    cc: "us",
    mc: "EUR"
    });