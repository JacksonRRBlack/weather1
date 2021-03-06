var city = [];
var temp = [];
var humidity = [];
var speed = [];
var pressure = [];
var description = [];

var city1 = [];
var temp1 = [];
var humidity1 = [];
var speed1 = [];
var pressure1 = [];
var description1 = [];

var coords = [];
var lat = [];
var lon = [];
var api;


var todayTemp = document.querySelector('.todayTemp');
var setCity = document.querySelector('.city');
var setHumidity = document.querySelector('.humidity');
var setSpeed = document.querySelector('.speed');
var setPressure = document.querySelector('.pressure');
var textAnimation = document.querySelector('.text_animation');
var celsius = document.querySelector('.celsius');
var img = document.createElement("img");
var src = document.querySelector('.weather');
var i = 0;
var timerUpdateWeather;
var timeoutUpdateWeather;

var promiseResponseReceived;

// document.addEventListener("DOMContentLoaded", function () {
//     widgetHelpers.startMessagingClient(true);
//     widgetHelpers.sendWidgetIsPrepared();
// });

$(document).ready(function () {
    widgetHelpers.startMessagingClient(true);
    widgetHelpers.sendWidgetIsPrepared();
});

function updateParams(params, apiKeys) {
    console.log(params);
    console.log(apiKeys);
    api = apiKeys.openweathermap;
    coords = params.coords;
    lat = [];
    lon = [];
    transferWeather(api, coords);
}

function writeCoordsCity(coords) {
    for (var k = 0; k < coords.length; k++) {
        var splitCoords = coords[k].split(',', 2);
        if (splitCoords[0] >= -90 && splitCoords[0] <= 90 && splitCoords[1] >= -180 && splitCoords[1] <= 180) {
            lat.push(+splitCoords[0]);
            lon.push(+splitCoords[1]);
        }
    }
}

function showStub() {
    document.querySelector('.stub').style.display = "block";
    document.querySelector('.widget').style.display = "none";
}

function hideStub() {
    document.querySelector('.stub').style.display = "none";
    document.querySelector('.widget').style.display = "block";
}

function getWeather() {
    city1 = [];
    temp1 = [];
    humidity1 = [];
    speed1 = [];
    pressure1 = [];
    description1 = [];
    promiseResponseReceived = new Promise(function (resolve, reject) {
        for (var l = 0; l < lat.length; l++) {
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat[l] + '&lon=' + lon[l] + '&APPID=' + api + '&units=metric',
                dataType: 'json',
                success: function (data) {
                    console.log(data);

                    var roundTemp = Math.round(data.main.temp);
                    if (roundTemp > 0) {
                        temp1.push('+' + roundTemp);
                    } else {
                        temp1.push(roundTemp);
                    }
                    humidity1.push(data.main.humidity);
                    speed1.push(data.wind.speed);
                    pressure1.push(data.main.pressure);
                    description1.push(data.weather[0].main);
                    city1.push(data.name);
                    console.log(temp1);
                    if (temp1.length === lat.length) {
                        resolve();
                    }
                },
                error: function (data) {
                    reject();
                },
            });
        }
    });
    promiseResponseReceived.then(
        function () {
            city = city1;
            temp = temp1;
            humidity = humidity1;
            speed = speed1;
            pressure = pressure1;
            description = description1;
            timeoutUpdateWeather = 1000 * 60 * 60;
        },
        function () {
            timeoutUpdateWeather = 1000 * 60;
        });
}

function transferWeather(api, coords) {
    console.log(coords);

    writeCoordsCity(coords);
    console.log(lat, lon);

    jQuery(document).ready(function ($) {
        if (timerUpdateWeather) {
            clearTimeout(timerUpdateWeather);
        }
        timerUpdateWeather = setTimeout(function updateWeather() {
            getWeather();
            timerUpdateWeather = setTimeout(updateWeather, timeoutUpdateWeather);
        }, 0);
    });
}


function setAll() {
    todayTemp.classList.remove("anim_todayTemp2");
    setCity.classList.remove("anim_setCity2");
    src.classList.remove("anim_src2");
    textAnimation.classList.remove("anim_text2");
    celsius.classList.remove("anim_todayTemp2");
    todayTemp.classList.add("anim_todayTemp1");
    setCity.classList.add("anim_setCity1");
    src.classList.add("anim_src1");
    textAnimation.classList.add("anim_text1");
    celsius.classList.add("anim_todayTemp1");
    setTimeout(function () {
        todayTemp.classList.remove("anim_todayTemp1");
        setCity.classList.remove("anim_setCity1");
        src.classList.remove("anim_src1");
        textAnimation.classList.remove("anim_text1");
        celsius.classList.remove("anim_todayTemp1");
        todayTemp.classList.add("anim_todayTemp2");
        setCity.classList.add("anim_setCity2");
        src.classList.add("anim_src2");
        textAnimation.classList.add("anim_text2");
        celsius.classList.add("anim_todayTemp2");
    }, 2000);
    todayTemp.textContent = temp[i];
    setCity.textContent = city[i];
    setHumidity.textContent = humidity[i] + '%';
    setSpeed.textContent = speed[i] + ' м/с';
    setPressure.textContent = pressure[i] + ' мм рт.ст.';

    if (description[i] === "Clear") {
        img.src = "animated/Clear.svg";
    } else if (description[i] === "Clouds") {
        img.src = "animated/Clouds.svg";
    } else if (description[i] === "Thunderstorm") {
        img.src = "animated/Thunderstorm.svg";
    } else if (description[i] === "Drizzle") {
        img.src = "animated/Drizzle.svg";
    } else if (description[i] === "Rain") {
        img.src = "animated/Rain.svg";
    } else if (description[i] === "Snow") {
        img.src = "animated/Snow.svg";
    } else {
        img.src = "animated/cloudy.svg";
    }
    src.appendChild(img);

    i++;
    if (i > temp.length - 1) {
        i = 0;
    }
    timer = setTimeout(setAll, 4000);
    if (temp.length) {
        hideStub();
        widgetHelpers.sendWidgetIsReady();
    }
};
showStub();
setAll();

// function readCityList() {
//     var cityList = new XMLHttpRequest();
//     cityList.open('GET', 'city.list.json', false);
//     cityList.onreadystatechange = function () {
//         if (cityList.readyState === 4) {
//             if (cityList.status === 200 || cityList.status == 0) {
//                 var allText = cityList.responseText;
//                 parseCityList = JSON.parse(allText);
//                 console.log(parseCityList[3].coord);
//
//             }
//         }
//     }
//     cityList.send();
// }
// readCityList('city.list.json');

// function getWeather(ap,par) {
//     console.log(api);
//     // console.log(parseCityList);
//     console.log(coords);
//
//     function writeIdCity() {
//         for (var k = 0; k < coords.length; k++) {
//             var splitCoords = coords[k].split(',', 2);
//             var lat[k] = +splitCoords[0];
//             var lon[k] = +splitCoords[1];
//             for (var l = 0; l < parseCityList.length; l++) {
//                  if (+splitCoords[0] === parseCityList[l].coord.lon && +splitCoords[1] === parseCityList[l].coord.lat) {
//                      idCity[k] = parseCityList[l].id;
//                      city[k] = parseCityList[l].name;
//                  } else {
//                      l++;
//                  }
//              }
//         }
//     }
//
//     writeIdCity();
//
//
//     jQuery(document).ready(function ($) {
//
//         $.ajax({
//             url: 'https://api.openweathermap.org/data/2.5/group?id=' + idCity + '&APPID=' + api + '&units=metric&cnt=10',
//             dataType: 'json',
//             success: function (data) {
//                 for (var j = 0; j < city.length; j++) {
//                     if (Math.round(data.list[j].main.temp) > 0) {
//                         temp[j] = '+' + Math.round(data.list[j].main.temp);
//                     } else {
//                         temp[j] = Math.round(data.list[j].main.temp);
//                     }
//                     humidity[j] = data.list[j].main.humidity;
//                     speed[j] = data.list[j].wind.speed;
//                     pressure[j] = data.list[j].main.pressure;
//                     description[j] = data.list[j].weather[0].main;
//                 }
//                 var todayTemp = document.querySelector('.todayTemp');
//                 var setCity = document.querySelector('.city');
//                 var setHumidity = document.querySelector('.humidity');
//                 var setSpeed = document.querySelector('.speed');
//                 var setPressure = document.querySelector('.pressure');
//                 var textAnimation = document.querySelector('.text_animation');
//                 var celsius = document.querySelector('.celsius');
//                 var img = document.createElement("img");
//                 var src = document.querySelector('.weather');
//                 var i = 0;
//
//                 function setAll() {
//                     todayTemp.classList.remove("anim_todayTemp2");
//                     setCity.classList.remove("anim_setCity2");
//                     src.classList.remove("anim_src2");
//                     textAnimation.classList.remove("anim_text2");
//                     celsius.classList.remove("anim_todayTemp2");
//                     todayTemp.classList.add("anim_todayTemp1");
//                     setCity.classList.add("anim_setCity1");
//                     src.classList.add("anim_src1");
//                     textAnimation.classList.add("anim_text1");
//                     celsius.classList.add("anim_todayTemp1");
//                     setTimeout(function () {
//                         todayTemp.classList.remove("anim_todayTemp1");
//                         setCity.classList.remove("anim_setCity1");
//                         src.classList.remove("anim_src1");
//                         textAnimation.classList.remove("anim_text1");
//                         celsius.classList.remove("anim_todayTemp1");
//                         todayTemp.classList.add("anim_todayTemp2");
//                         setCity.classList.add("anim_setCity2");
//                         src.classList.add("anim_src2");
//                         textAnimation.classList.add("anim_text2");
//                         celsius.classList.add("anim_todayTemp2");
//                     }, 2000);
//                     todayTemp.textContent = temp[i];
//                     setCity.textContent = city[i];
//                     setHumidity.textContent = humidity[i] + '%';
//                     setSpeed.textContent = speed[i] + ' м/с';
//                     setPressure.textContent = pressure[i] + ' мм рт.ст.';
//
//                     if (description[i] === "Clear") {
//                         img.src = "animated/Clear.svg";
//                     } else if (description[i] === "Clouds") {
//                         img.src = "animated/Clouds.svg";
//                     } else if (description[i] === "Thunderstorm") {
//                         img.src = "animated/Thunderstorm.svg";
//                     } else if (description[i] === "Drizzle") {
//                         img.src = "animated/Drizzle.svg";
//                     } else if (description[i] === "Rain") {
//                         img.src = "animated/Rain.svg";
//                     } else if (description[i] === "Snow") {
//                         img.src = "animated/Snow.svg";
//                     } else {
//                         img.src = "animated/cloudy.svg";
//                     }
//                     src.appendChild(img);
//
//
//                     i++;
//                     if (i > temp.length - 1) {
//                         i = 0;
//                     }
//                     timer = setTimeout(setAll, 4000);
//                 };
//                 setAll();
//
//             }
//         });
//     });
// }