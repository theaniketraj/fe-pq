document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: Replace with your own OpenWeatherMap API key
    const API_KEY = "YOUR_API_KEY";
    const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    // DOM Elements
    const cityInputElement = document.getElementById('cityInput');
    const searchButtonElement = document.getElementById('searchBtn');
    const loadingIndicatorElement = document.getElementById('loadingIndicator');
    const errorMessageElement = document.getElementById('errorMessage');
    const weatherInfoElement = document.getElementById('weatherInfo');

    const cityNameElement = document.getElementById('cityName');
    const currentDateTimeElement = document.getElementById('currentDateTime');
    const weatherIconElement = document.getElementById('weatherIcon');
    const tempValueElement = document.getElementById('tempValue');
    const weatherDescriptionElement = document.getElementById('weatherDescription');
    const feelsLikeElement = document.getElementById('feelsLike');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('windSpeed');
    const pressureElement = document.getElementById('pressure');

    // Event Listeners
    searchButtonElement.addEventListener('click', fetchWeather);
    cityInputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            fetchWeather();
        }
    });

    async function fetchWeather() {
        const city = cityInputElement.value.trim();
        if (!city) {
            displayError("Please enter a city name.");
            return;
        }

        if (API_KEY === "YOUR_API_KEY") {
            displayError("Please replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key in script.js.");
            return;
        }

        showLoading(true);
        hideError();
        hideWeatherInfo();

        try {
            const response = await fetch(`${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`); // units=metric for Celsius

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayWeatherData(data);

        } catch (error) {
            console.error("Error fetching weather data:", error);
            displayError(`Failed to fetch weather: ${error.message}. Please try again.`);
        } finally {
            showLoading(false);
        }
    }

    function displayWeatherData(data) {
        if (!data || !data.main || !data.weather || !data.weather[0]) {
            displayError("Received incomplete weather data. Please try another city.");
            return;
        }

        cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
        currentDateTimeElement.textContent = formatDate(new Date(data.dt * 1000)); // dt is Unix timestamp

        weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIconElement.alt = data.weather[0].description;

        tempValueElement.textContent = Math.round(data.main.temp);
        weatherDescriptionElement.textContent = data.weather[0].description;

        feelsLikeElement.textContent = `${Math.round(data.main.feels_like)} °C`;
        humidityElement.textContent = `${data.main.humidity} %`;
        windSpeedElement.textContent = `${data.wind.speed.toFixed(1)} m/s`; // toFixed(1) for one decimal place
        pressureElement.textContent = `${data.main.pressure} hPa`;

        showWeatherInfo();
    }

    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    }

    function showLoading(isLoading) {
        loadingIndicatorElement.style.display = isLoading ? 'block' : 'none';
    }

    function displayError(message) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
        hideWeatherInfo();
    }

    function hideError() {
        errorMessageElement.style.display = 'none';
    }

    function showWeatherInfo() {
        weatherInfoElement.style.display = 'block';
    }

    function hideWeatherInfo() {
        weatherInfoElement.style.display = 'none';
    }

    // Optional: Fetch weather for a default city on load or based on geolocation
    // For example:
    // cityInputElement.value = "London";
    // fetchWeather();
});