// Import React along with some helpful hooks
import React, { useState, useEffect, useRef } from "react";

// Import CSS styling and all the images we need for the weather icons
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/clouds.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

// Create the main Weather component
const Weather = () => {
  // Create a reference to the search input field
  const inputRef = useRef();

  // Create a piece of state to hold the weather data we get back from the API
  const [weatherData, setWeatherData] = useState(null);

  // Create a piece of state to handle any errors that might happen during the search
  const [error, setError] = useState(null);

  // Map OpenWeather API codes to our local icon images
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  // Function that will call the OpenWeather API based on the city name
  const search = async (city) => {
    // If no city is entered, show an error
    if (!city) {
      setError("Please enter a city name");
      setWeatherData(null); // Reset previous weather data
      return;
    }

    try {
      // Build the API request URL dynamically
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      // Make the API request
      const response = await fetch(url);
      const data = await response.json();

      // If request was successful
      if (response.ok) {
        // Pick the correct weather icon based on conditions
        const mainCondition = data.weather[0].main.toLowerCase();
        let icon = clear_icon; // Default to clear_icon

        if (mainCondition.includes("cloud")) {
          icon = cloud_icon;
        } else if (mainCondition.includes("rain")) {
          icon = rain_icon;
        } else if (mainCondition.includes("drizzle")) {
          icon = drizzle_icon;
        } else if (mainCondition.includes("snow")) {
          icon = snow_icon;
        } else if (mainCondition.includes("clear")) {
          icon = clear_icon;
        }

        // Save the important weather data to state
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });

        setError(null); // Clear any old errors if everything works
      } else {
        // If API call failed, show error
        setWeatherData(null);
        setError(data.message || "Error fetching weather data");
      }
    } catch (error) {
      // Catch any unexpected errors
      setWeatherData(null);
      setError("Error fetching weather data");
      console.error("Error:", error);
    }
  };

  // useEffect runs once when the page loads — this automatically searches for "Red Lion"
  useEffect(() => {
    search("Red Lion");
  }, []);

  // The actual JSX (HTML structure) returned by the Weather component
  return (
    <div className="weather">
      {/* Search bar with an input and clickable search icon */}
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search..." />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {/* If there's an error, show it */}
      {error && <p className="error">{error}</p>}

      {/* If we have weather data, display it */}
      {weatherData ? (
        <>
          <img
            src={weatherData.icon}
            alt="Weather Icon"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature}°F</p>
          <p className="location">{weatherData.location}</p>

          {/* Show humidity and wind speed */}
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity Icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="Wind Icon" />
              <div>
                <p>{weatherData.windSpeed} mph</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        // If no weather data yet but no error, show "Loading..."
        !error && <p className="loading">Loading weather data...</p>
      )}
    </div>
  );
};

// Export the Weather component so we can use it in other parts of our app
export default Weather;
