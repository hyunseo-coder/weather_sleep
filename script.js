const weather = {
  apiKey: "4327b7e43d737f405786d21089c71424", // OpenWeatherMap API 키 입력
  fetchWeather: function (city) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Weather data not available");
      }
      return response.json();
    });
  },
};

const astronomy = {
  fetchAstronomyEvent: function () {
    return fetch(
      `https://api.nasa.gov/planetary/apod?api_key=fci0x37FNlH6WcAe9gVgj10XPEYlqQEy3Zp1bDDT` // NASA APOD API 키 입력
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Astronomy event data not available");
      }
      return response.json();
    });
  },
};

function generateSleepAdvice(temp, humidity, description) {
  let advice = "Sleep Advice:\n";

  if (temp > 25) {
    advice += "It's quite warm. Ensure your room is well ventilated or use an air conditioner.\n";
  } else if (temp < 15) {
    advice += "It's quite cold. Make sure to use warm blankets.\n";
  } else {
    advice += "The temperature is comfortable. Ensure your room is dark and quiet.\n";
  }

  if (humidity > 70) {
    advice += "The humidity is high. Consider using a dehumidifier.\n";
  } else if (humidity < 30) {
    advice += "The air is dry. Using a humidifier can improve sleep quality.\n";
  }

  if (description.includes("rain") || description.includes("storm")) {
    advice += "It's rainy or stormy. The sound of rain can be soothing for sleep.\n";
  } else if (description.includes("clear")) {
    advice += "It's clear outside. Make sure your room is dark to avoid light pollution.\n";
  }

  return advice;
}

function displayWeatherAndAstronomy(weatherData, astronomyData) {
  const { name } = weatherData;
  const { icon, description } = weatherData.weather[0];
  const { temp, humidity } = weatherData.main;
  const { speed } = weatherData.wind;

  document.querySelector(".city").innerText = `Weather in ${name}`;
  document.querySelector(".temp").innerText = `${temp}°C`;
  document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
  document.querySelector(".description").innerText = description;
  document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
  document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
  document.querySelector(".weather").classList.remove("loading");
  document.querySelector(".astronomy").innerHTML = `
    <h3 class="title">Astronomy Event</h3>
    <p class="event-title">${astronomyData.title}</p>
    <img class="event-image" src="${astronomyData.url}" alt="${astronomyData.title}">
    <p class="event-description">${astronomyData.explanation}</p>
  `;
  document.querySelector(".astronomy").classList.remove("loading");

  const sleepAdvice = generateSleepAdvice(temp, humidity, description);
  document.querySelector(".sleep-advice").innerText = sleepAdvice;
}

function fetchWeatherAndAstronomy(city) {
  Promise.all([
    weather.fetchWeather(city),
    astronomy.fetchAstronomyEvent(),
  ])
    .then(([weatherData, astronomyData]) => {
      displayWeatherAndAstronomy(weatherData, astronomyData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again later.");
    });
}

document.querySelector(".search button").addEventListener("click", function () {
  const city = document.querySelector(".search-bar").value.trim();
  if (city) {
    fetchWeatherAndAstronomy(city);
  } else {
    alert("Please enter a city name.");
  }
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const city = document.querySelector(".search-bar").value.trim();
    if (city) {
      fetchWeatherAndAstronomy(city);
    } else {
      alert("Please enter a city name.");
    }
  }
});

// 초기값으로 Denver의 날씨와 천문학 이벤트 불러오기
fetchWeatherAndAstronomy("Denver");
