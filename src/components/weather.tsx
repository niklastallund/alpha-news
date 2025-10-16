"use client";

import React, { useState } from "react";

type WeatherCondition = {
  description: string;
  icon: string;
};

type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
  };
};

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  async function getWeather() {
    if (!city.trim()) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("City not found");

      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") void getWeather();
  }

  return (
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-8">
          Weather Forecast
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
          />
          <button
            onClick={getWeather}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? "Loading..." : "Get"}
          </button>
        </div>

        <div className="mt-4 text-lg">
          {error && <p className="text-red-600">{error}</p>}

          {weather && (
            <div className="bg-gradient-to-br from-sky-100 to-blue-200 shadow-lg rounded-2xl p-6 max-w-md mx-auto text-gray-800 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-2 text-blue-800">
                Weather in {weather.name}
              </h2>

              <div className="flex items-center justify-center space-x-2 mb-4">
                {Math.round(weather.main.temp) <= 0 ? (
                  // SNÖ / KYLA
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v18m9-9H3m15.364-6.364L5.636 
            17.364M17.364 17.364L6.636 6.636"
                    />
                  </svg>
                ) : weather.weather[0].description
                    .toLowerCase()
                    .includes("cloud") ? (
                  // MOLNIGT
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 014-4h1a5 5 0 019.9.6A4 4 0 0119 20H7a4 4 0 01-4-5z"
                    />
                  </svg>
                ) : (
                  // SOLIGT
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2v2m0 16v2m10-10h-2M4 
            12H2m15.364-7.364l-1.414 
            1.414M6.05 17.95l-1.414 
            1.414m0-13.414L6.05 
            6.05M17.95 17.95l1.414 
            1.414M12 6a6 6 0 100 12 
            6 6 0 000-12z"
                    />
                  </svg>
                )}

                <span className="text-6xl font-semibold text-blue-700">
                  {Math.round(weather.main.temp)}°C
                </span>
              </div>

              <div className="space-y-2 text-lg">
                <p className="capitalize text-blue-900 font-medium">
                  {weather.weather[0].description}
                </p>
                <p className="capitalize text-blue-900 font-medium">
                  {" "}
                  Humidity: {weather.main.humidity}%
                </p>
                <p className="capitalize text-blue-900 font-medium">
                  {" "}
                  Wind: {weather.wind.speed} m/s
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

  );
}
