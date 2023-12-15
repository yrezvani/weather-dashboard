// .history-btn inside #history,
//current box: parent: #today, Elements:h2, p, p, p
// forecast: parent: #forecast-container, then future-day div, Elements:p, div, p, p, p

const apiKey = '0160e5812911c2bb6f25d93dcc531df6';

$(document).ready(function () {
    const searchForm = $('#search-form');
    searchForm.on('submit', function (e) {
        e.preventDefault();
        const searchInputEl = $('#search-input');
        const cityName = searchInputEl.val();

        const currentWeather = function () {
            const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0160e5812911c2bb6f25d93dcc531df6&units=metric&units=metric`;

            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
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
                });
        };

        currentWeather();
    });
});
