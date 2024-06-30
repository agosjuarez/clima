import React, { useState, useEffect } from 'react';

const API_KEY = '88c4aa726d6bc4cddb5d2787bd191a6e';

function App() {
  const [city, setCity] = useState('Barcelona');
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${API_KEY}`);
      const data = await response.json();
      setWeather(data);
      await saveSearch(city); // Save search to history
    } catch (error) {
      console.error('Error fetching the weather data:', error);
    }
  };

  const saveSearch = async (city) => {
    try {
      await fetch('http://localhost:5000/historial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city }),
      });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const cityInput = event.target.elements.city.value;
    setCity(cityInput);
  };

  const handleCityClick = (city) => {
    setCity(city);
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/historial');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch('http://localhost:5000/historial', {
        method: 'DELETE',
      });
      setHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clear':
        return 'public/icons/soleado.svg';
      case 'Clouds':
        return 'public/icons/nublado.svg';
      case 'Rain':
        return 'public/icons/lluvia.svg';
      case 'Snow':
        return 'public/icons/nieve.svg';
      case 'Thunderstorm':
        return 'public/icons/tormentaelectrica.svg';
      default:
        return 'public/icons/soleado.svg';
    }
  };

  return (
    <div className="container">
      <nav>
        <ul>
          <li><strong>Clima</strong></li>
        </ul>
        <ul>
          <li><a href="#" onClick={() => handleCityClick('Tucuman')}>Tucuman</a></li>
          <li><a href="#" onClick={() => handleCityClick('Salta')}>Salta</a></li>
          <li><a href="#" onClick={() => handleCityClick('Buenos Aires')}>Buenos Aires</a></li>
        </ul>
      </nav>

      <main>
        <form onSubmit={handleSearch}>
          <input
            type="search"
            name="city"
            placeholder="Buscar"
            aria-label="Buscar"
          />
        </form>

        <article>
          {weather && (
            <section id="weatherSection">
              <header>
                <h2>{weather.name}</h2>
              </header>
              <img src={getWeatherIcon(weather.weather[0].main)} alt="icon-weather" />
              <footer>
                <h3>Temperatura: {weather.main.temp}°C</h3>
                <p>Mínima: {weather.main.temp_min}°C / Máxima: {weather.main.temp_max}°C</p>
                <p>Humedad: {weather.main.humidity}%</p>
              </footer>
            </section>
          )}
        </article>

        <button onClick={fetchHistory}>Mostrar Historial</button>
        <button onClick={clearHistory}>Eliminar Historial</button>

        {history.length > 0 && (
          <section>
            <h2>Historial de Búsqueda</h2>
            <ul>
              {history.map((item) => (
                <li key={item._id}>{item.city} - {new Date(item.date).toLocaleString()}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
