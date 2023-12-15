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

                const date = dayjs().format('DD/MM/YYYY');
                const temperature = data.main.temp;
                const wind = data.wind.speed;
                const humidity = data.main.humidity;

                const todayEl = $('#today');
                todayEl.empty();

                const dateEl = $('<h2>');
                dateEl.text(`${city} (${date})`);
                const tempEl = $('<p>');
                tempEl.text(`Temp: ${temperature}`);
                const windEl = $('<p>');
                windEl.text(`Wind: ${wind}`);
                const humidityEl = $('<p>');
                humidityEl.text(`Humidity: ${humidity}`);
                todayEl.append(dateEl, tempEl, windEl, humidityEl);
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
                fiveDayForecast.forEach(function (day) {
                    const date = dayjs(day.dt_txt.split(` `)[0], 'YYYY/MM/DD').format('DD/MM/YYYY');
                    const temperature = day.main.temp;
                    const wind = day.wind.speed;
                    const humidity = day.main.humidity;

                    const dayEl = $('<div>');
                    dayEl.addClass('future-day');

                    const dateEl = $('<p>');
                    dateEl.text(`${city} (${date})`);

                    const tempEl = $('<p>');
                    tempEl.text(`Temp: ${temperature}`);

                    const windEl = $('<p>');
                    windEl.text(`Wind: ${wind}`);

                    const humidityEl = $('<p>');
                    humidityEl.text(`Humidity: ${humidity}`);

                    dayEl.append(dateEl, tempEl, windEl, humidityEl);
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
            console.log(button);
            cityName = button.text();
            console.log(cityName);
            currentWeather();
            fiveDayForecast();
        });
    };

    const renderHistBtn = function () {
        let cityName = searchInputEl.val();
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        const newBtn = $('<button>');

        if (!savedCities.includes(cityName)) {
            newBtn.text(cityName);
            newBtn.addClass('history-btn');
            historyEl.prepend(newBtn);

            if (savedCities.length === 10) {
                savedCities.pop();
            }
            savedCities.push(cityName);
            console.log(savedCities);
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
