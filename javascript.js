
function searchCity(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=0e92073c3c58ca34ad6188f84fccee10";
    var queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=0e92073c3c58ca34ad6188f84fccee10";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        $(".city-display").empty();
        var currentDate = " (" + moment().format("MM/DD/YYYY") + ") ";

        var currentInfoDiv = $("<div>");

        var cityNameH = $("<h2>").text(response.name);
        var displayDate = cityNameH.append(" " + currentDate);
        var temp = $("<p>").text("Tempraturer: " + response.main.temp + "°");
        var wind = $("<p>").text("Wind Speed: " + response.wind.speed + " mph");
        var hum = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentweather = response.weather[0].main;

        if (currentweather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 100px; width: 100px");
        } 
        else if (currentweather === "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 100px; width: 100px");
        } 
        else if (currentweather === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 100px; width: 100px");
        }
        else if (currentweather === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 100px; width: 100px");
        }
        else if (currentweather === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 100px; width: 100px");
        }

        currentInfoDiv.append(displayDate, currentIcon, temp, hum, wind);
        $(".city-display").html(currentInfoDiv);
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var uvUrlLink = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: uvUrlLink,
            method: "GET"
        }).then(function(response2) {
            console.log(response2);
            $('#uv-index').empty();
            var uvResult = response2.value;
            console.log(uvResult);
            var uvlEl = $("<p>").text("UV Index: " + uvResult);
            

            if(response2.value < 3) {
                $("#uv-index").addClass("safe-uv").removeClass("warning-uv danger-uv big-danger-uv extreme-uv");
            }
            else if(response2.value < 6) {
                $("#uv-index").addClass("warning-uv").removeClass("safe-uv danger-uv big-danger-uv extreme-uv");
            }
            else if(response2.value < 8){
                $("#uv-index").addClass("danger-uv").removeClass("warning-uv safe-uv big-danger-uv extreme-uv");
            }
            else if(response2.value < 11){
                $("#uv-index").addClass("big-danger-uv").removeClass("warning-uv danger-uv safe-uv extreme-uv");
            }
            else{
                $("#uv-index").addClass("extreme-uv").removeClass("warning-uv danger-uv big-danger-uv safe-uv");
            }

            $("#uv-index").html(uvlEl);
        });
    });

    $.ajax({
        url: queryURLforcast,
        method: 'GET'
    }).then(function (response) {
        var results = response.list;
        $("#future-weather-container").empty();
        for (var i = 0; i < results.length; i += 8) {
            var fiveDayDiv = $("<div class='future-info'>");
            var date = results[i].dt_txt;
            var setDate = date.substr(0, 10)
            var temp = results[i].main.temp;
            var hum = results[i].main.humidity;
            var hFiveDate = $("<h5 class='card-title'>").text(setDate);
            var pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
            var pHum = $("<p class='card-text'>").text("Humidity " + hum);;
            var weather = results[i].weather[0].main
            if (weather === "Clear") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                icon.attr("style", "height: 80px; width: 80px");
            } else if (weather === "Clouds") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                icon.attr("style", "height: 80px; width: 80px");
            }
            else if (weather === "Rain") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                icon.attr("style", "height: 80px; width: 80px");
            }
            else if (weather === "Snow") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                icon.attr("style", "height: 80px; width: 80px");
            }
            else if (weather === "Drizzle") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                icon.attr("style", "height: 80px; width: 80px");
            }
            
            fiveDayDiv.append(hFiveDate);
            fiveDayDiv.append(icon);
            fiveDayDiv.append(pTemp);
            fiveDayDiv.append(pHum);
            $("#future-weather-container").append(fiveDayDiv);
        }
    });
}
loadPage();

$(".search-btn").click( function(event) {
    event.preventDefault();

    let cityName = $(".city-search").val();

    var cityArray = [];
    cityArray.push(cityName);

    localStorage.setItem('city', JSON.stringify(cityArray));
    
    searchCity(cityName);
    loadPage();
});

function loadPage() {
    var lastSearch = JSON.parse(localStorage.getItem("city"));
    var searchDiv = $("<button class = 'btn city-btn'>").text(lastSearch);
    var psearch = $("<div id = 'city'>");
    psearch.append(searchDiv);
    $("#city-button-container").prepend(psearch);
}

$("#city-button-container").on('click', '.btn', function (event) {
    event.preventDefault();
    console.log($(this).text());
    searchCity($(this).text());
});