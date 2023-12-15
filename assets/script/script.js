$(document).ready(function () {
    const searchForm = $('#search-form');
    const historyEl = $('#history');
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    const searchInputEl = $('#search-input');
    let cityName = searchInputEl.val();

    const renderPreviousCities = function () {
        if (savedCities.length !== 0) {
            for (const city of savedCities) {
                const newBtn = $('<button>');
                newBtn.text(city);
                newBtn.addClass('history-btn');
                historyEl.prepend(newBtn);
            }
        }
    };

    const findIcon = function (code) {
        const baseURL = 'https://openweathermap.org/img/wn/';
        if (code >= 200 && code < 300) {
            return `${baseURL}11d.png`;
        } else if (code >= 300 && code < 400) {
            return `${baseURL}09d.png`;
        } else if (code >= 500 && code < 511) {
            return `${baseURL}10d.png`;
        } else if (code === 511) {
            return `${baseURL}13d.png`;
        } else if (code >= 520 && code < 600) {
            return `${baseURL}09d.png`;
        } else if (code >= 600 && code < 700) {
            return `${baseURL}13d.png`;
        } else if (code >= 701 && code < 800) {
            return `${baseURL}50d.png`;
        } else if (code === 800) {
            return `${baseURL}01d.png`;
        } else if (code === 801) {
            return `${baseURL}02d.png`;
        } else if (code === 802) {
            return `${baseURL}03d.png`;
        } else if (code >= 803) {
            return `${baseURL}04d.png`;
        }
    };

    const currentWeather = function () {
        const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0160e5812911c2bb6f25d93dcc531df6&units=metric&units=metric`;

        fetch(queryURL)
            .then(function (response) {
                // validating city name entered
                if (!response.ok) {
                    throw new Error('City not found or API request failed');
                }
                return response.json();
            })
            .then(function (data) {
                const city = data.name;
                const weatherCode = data.weather[0].id;
                const date = dayjs().format('DD/MM/YYYY');
                const temperature = parseInt(data.main.temp);
                const wind = parseInt(data.wind.speed);
                const humidity = data.main.humidity;

                const todayEl = $('#today');
                todayEl.empty();
                todayEl.css('background-color', '#3a7bc8');
                todayEl.css('border', '1px solid black');

                const dateEl = $('<h2>');
                dateEl.text(`${city} (${date})`);

                const iconEl = $('<span>');
                const iconImg = $('<img>');
                iconImg.attr('src', findIcon(weatherCode));

                const tempEl = $('<p>');
                tempEl.text(`Temp: ${temperature}°C`);

                const windEl = $('<p>');
                windEl.text(`Wind: ${wind} KPH`);

                const humidityEl = $('<p>');
                humidityEl.text(`Humidity: ${humidity}%`);
                dateEl.append(iconImg);
                todayEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
                console.log(dateEl);
            })
            .catch(function (error) {
                alert('City not found or there was an API request error');
            });
    };

    const fiveDayForecast = function () {
        const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=0160e5812911c2bb6f25d93dcc531df6&units=metric`;

        fetch(queryURL)
            .then(function (response) {
                // Validating city name entered
                if (!response.ok) {
                    throw new Error('City not found or API request failed');
                }
                return response.json();
            })
            .then(function (data) {
                const city = data.city.name;
                // grabbing weather data for the same time for 5 days
                const desiredTime = '12:00:00';
                const fiveDayForecast = data.list.filter(function (weatherInfo) {
                    // Extract the time from the timestamp
                    const timestamp = weatherInfo.dt_txt.split(' ')[1]; // Get the time part
                    return timestamp === desiredTime;
                });

                //rendering to DOM
                const forecastEl = $('.forecast-container');
                forecastEl.empty();
                const headingEl = $('<h4>');
                $('#forecast h4:first-child').remove();
                headingEl.text('5-Day Forecast');
                $('#forecast').prepend(headingEl);
                fiveDayForecast.forEach(function (day) {
                    const date = dayjs(day.dt_txt.split(` `)[0], 'YYYY/MM/DD').format('DD/MM/YYYY');
                    const temperature = parseInt(day.main.temp);
                    const wind = parseInt(day.wind.speed);
                    const humidity = day.main.humidity;
                    const weatherCode = day.weather[0].id;

                    const dayEl = $('<div>');
                    dayEl.addClass('future-day');

                    const dateEl = $('<p>');
                    dateEl.text(`${city} (${date})`);

                    const iconEl = $('<img>');
                    iconEl.attr('src', findIcon(weatherCode));

                    const tempEl = $('<p>');
                    tempEl.text(`Temp: ${temperature}°C`);

                    const windEl = $('<p>');
                    windEl.text(`Wind: ${wind} KPH`);

                    const humidityEl = $('<p>');
                    humidityEl.text(`Humidity: ${humidity}%`);

                    dayEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
                    forecastEl.append(dayEl);
                });
            })
            .catch(function (error) {
                alert('City not found or there was an API request error');
            });
    };

    const histBtnListener = function () {
        $('#history').on('click', '.history-btn', function (e) {
            cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
            const button = $(e.target);
            cityName = button.text();
            currentWeather();
            fiveDayForecast();
        });
    };
    // Generate buttons as search history
    const renderHistBtn = function () {
        let cityName = searchInputEl.val();
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        const newBtn = $('<button>');

        if (!savedCities.includes(cityName)) {
            if (savedCities.length === 10) {
                historyEl.children(':last').remove();
                savedCities.pop();
            }
            console.log(savedCities);
            newBtn.text(cityName);
            newBtn.addClass('history-btn');
            historyEl.prepend(newBtn);

            savedCities.push(cityName);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
        }
    };

    renderPreviousCities();

    histBtnListener();

    searchForm.on('submit', function (e) {
        e.preventDefault();
        cityName = searchInputEl.val();

        renderHistBtn();
        currentWeather();
        fiveDayForecast();
    });
});
