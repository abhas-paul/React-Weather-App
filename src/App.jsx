import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import './css/util.css';
import './css/tailwind.css';

function App() {
  // Handling the map

  const [location, setLocation] = useState('London');
  const [mapSrc, setMapSrc] = useState('');

  const updateMap = (searchLocation) => {
    if (!searchLocation) return;
    setLocation(searchLocation);
    setMapSrc(`https://maps.google.com/maps?q=${encodeURIComponent(searchLocation)}&output=embed`);
  };

  useEffect(() => {
    updateMap(location);
  }, []);

  //handeling serach  +  map

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search?.value;
    if (searchInput) {
      updateMap(searchInput);
    }
  };

  // Fetching API

  const apiKey = "YOUR_API_HERE"; // add your api here and do the required changes to get the code working

  // Current Weather State

  const [localtime, setlocaltime] = useState('');
  const [Icon, setIcon] = useState('');
  const [temp, settemp] = useState();
  const [text, settext] = useState("");
  const [wind, setwind] = useState();
  const [uv, setuv] = useState();

  // Popular Cities State

  const [Delhiicon, setDelhiicon] = useState('');
  const [Mumbaiicon, setMumbaiicon] = useState('');
  const [Hyderabadicon, setHyderabadicon] = useState('');
  const [Bengaluruicon, setBengaluruicon] = useState('');
  const [Kolkataicon, setKolkataicon] = useState('');
  const [cityTemps, setCityTemps] = useState({
    Delhi: '--',
    Mumbai: '--',
    Hyderabad: '--',
    Bengaluru: '--',
    Kolkata: '--'
  });

  useEffect(() => {
    GetInfo(location, apiKey);
  }, [location, apiKey]);

  async function GetInfo(location, apiKey) {
    try {
      let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`);
      let data = await response.json();
      setlocaltime(data.location.localtime);
      setIcon(data.forecast.forecastday[0].day.condition.icon);
      settemp(data.current.temp_c);
      settext(data.forecast.forecastday[0].day.condition.text);
      setwind(data.current.wind_kph);
      setuv(data.current.uv);
      setHumidity(data.current.humidity);
      setFeelsLike(data.current.feelslike_c);
      setWindDir(data.current.wind_dir);
      setcloud(data.current.cloud);
      setsunrise(data.forecast.forecastday[0].astro.sunrise);
      setsunset(data.forecast.forecastday[0].astro.sunset);
      setmin_temp(data.forecast.forecastday[0].day.mintemp_c);
      setmax_temp(data.forecast.forecastday[0].day.maxtemp_c);
      describePrecipitation(data.forecast.forecastday[0].day.totalprecip_in);
      setHourlyData(data.forecast.forecastday[0].hour);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  // Popular Cities Data Fetch

  useEffect(() => {
    const PopularCit = ["Delhi", "Mumbai", "Hyderabad", "Bengaluru", "Kolkata"];

    async function PopularCitis(apiKey, cities) {
      const tempData = {};
      const iconData = {};

      for (const city of cities) {
        try {
          let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
          let data = await response.json();
          tempData[city] = Math.round(data.current.temp_c);
          iconData[city] = data.current.condition.icon;
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
          tempData[city] = '--';
          iconData[city] = '//cdn.weatherapi.com/weather/64x64/day/116.png';
        }
      }

      // Update state for each city
      setDelhiicon(iconData.Delhi);
      setMumbaiicon(iconData.Mumbai);
      setHyderabadicon(iconData.Hyderabad);
      setBengaluruicon(iconData.Bengaluru);
      setKolkataicon(iconData.Kolkata);
      setCityTemps(tempData);
    }

    PopularCitis(apiKey, PopularCit);
  }, [apiKey]);

  //handeling {/* Today's Highlights */}

  const [Humidity, setHumidity] = useState()
  const [FeelsLike, setFeelsLike] = useState()
  const [WindDir, setWindDir] = useState("")

  //handeling {/* Summary Section */}

  const [cloud, setcloud] = useState()
  const [sunrise, setsunrise] = useState()
  const [sunset, setsunset] = useState()

  //handeling  {/* Climate estimate */}

  const [min_temp, setmin_temp] = useState()
  const [max_temp, setmax_temp] = useState()
  const [precip, setprecip] = useState("")

  function describePrecipitation(totalprecip_in) {
    if (totalprecip_in === 0) {
      setprecip("None")
    } else if (totalprecip_in < 0.1) {
      setprecip("Trace")
    } else if (totalprecip_in < 0.3) {
      setprecip("Light")
    } else if (totalprecip_in < 0.6) {
      setprecip("Modest")
    } else if (totalprecip_in < 1) {
      setprecip("Heavy")
    } else {
      setprecip("Soaky")
    }
  }

  //handeling {/* Hourly Summary */}

  const [HourlyData, setHourlyData] = useState()

  function HourlySum(hour) {
    return hour.map((h, index) => {
      const time = new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return (
        <div
          key={index}
          className="min-w-[80px] bg-[#041216] text-center rounded-xl p-3 shadow-md">
          <p className="text-xs text-[#5F828B] mb-1">{time}</p>
          <img
            src={`https:${h.condition.icon}`}
            alt="weather icon"
            width={40}
            className="mx-auto"
          />
          <p className="text-white font-bold mt-1">{Math.round(h.temp_c)}°</p>
        </div>
      );
    });
  }




  return (
    <main className="custom-scrollbar min-h-screen bg-[#041419] text-white font-sans p-6 flex flex-col justify-center items-center">
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Top bar: Search and User Icon */}
        <header className="md:col-span-4 flex justify-between items-center">
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <input
              name="search"
              type="search"
              placeholder="Search for location"
              className="shadow-xl bg-linear-to-r/srgb from-[#0C212A] to-[#0A1D26] text-white p-3 rounded-xl w-full"
            />
          </form>
        </header>

        {/* Current Weather */}
        <article className="border border-[#102630] bg-linear-to-r from-[#0A1E25] shadow-xl/30 rounded-2xl p-6">
          <time className="text-sm text-[#5F828B]">{localtime}</time>
          <section className="flex items-center mt-2">
            <figure className="w-9 h-9 rounded-full flex items-center justify-center">
              {Icon && <img width={50} src={`https:${Icon}`} alt="Weather icon" />}
            </figure>
            <span className="text-4xl font-bold ml-2">{temp}°</span>
          </section>
          <p className="text-lg font-semibold mt-2">{text}</p>
          <hr className='mt-[1rem] border border-[#102630]' />
          <section className="mt-4 text-[#5F828B] flex gap-[3rem] text-sm space-y-2">
            <p>Wind <br /> {wind} km/h</p>
            <p>UV Index <br /> {uv}</p>
          </section>
        </article>

        {/* Map Display */}
        <section className="border border-[#102630] bg-linear-to-r from-[#05171d] shadow-xl/60 rounded-2xl p-6 md:col-span-2 flex items-center justify-center">
          <figure className="h-40 w-full bg-linear-to-r from-[#0A1E25] inset-shadow-sm inset-shadow-[#0A1E25] rounded-xl flex items-center justify-center">
            {mapSrc && (
              <iframe
                src={mapSrc}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                title="Location Map"
              />
            )}
          </figure>
        </section>

        {/* Popular Cities */}
        <aside className="border border-[#102630] bg-linear-to-r from-[#0A1E25] shadow-xl/30 rounded-2xl p-6">
          <h2 className="text-xl mb-4 font-bold">Popular Cities</h2>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-300 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-2rem)]">
                {Delhiicon && <img src={`https:${Delhiicon}`} alt="Delhi weather" width={20} height={20} />}
                <strong className="overflow-hidden text-ellipsis whitespace-nowrap">Delhi</strong>
              </div>
              <span className='text-[#5F828B] overflow-hidden text-ellipsis whitespace-nowrap'>{cityTemps.Delhi}°</span>
            </li>
            <li className="text-gray-300 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-2rem)]">
                {Mumbaiicon && <img src={`https:${Mumbaiicon}`} alt="Mumbai weather" width={20} height={20} />}
                <strong className="overflow-hidden text-ellipsis whitespace-nowrap">Mumbai</strong>
              </div>
              <span className='text-[#5F828B] overflow-hidden text-ellipsis whitespace-nowrap'>{cityTemps.Mumbai}°</span>
            </li>
            <li className="text-gray-300 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-2rem)]">
                {Hyderabadicon && <img src={`https:${Hyderabadicon}`} alt="Hyderabad weather" width={20} height={20} />}
                <strong className="overflow-hidden text-ellipsis whitespace-nowrap">Hyderabad</strong>
              </div>
              <span className='text-[#5F828B] overflow-hidden text-ellipsis whitespace-nowrap'>{cityTemps.Hyderabad}°</span>
            </li>
            <li className="text-gray-300 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-2rem)]">
                {Bengaluruicon && <img src={`https:${Bengaluruicon}`} alt="Bengaluru weather" width={20} height={20} />}
                <strong className="overflow-hidden text-ellipsis whitespace-nowrap">Bengaluru</strong>
              </div>
              <span className='text-[#5F828B] overflow-hidden text-ellipsis whitespace-nowrap'>{cityTemps.Bengaluru}°</span>
            </li>
            <li className="text-gray-300 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-2rem)]">
                {Kolkataicon && <img src={`https:${Kolkataicon}`} alt="Kolkata weather" width={20} height={20} />}
                <strong className="overflow-hidden text-ellipsis whitespace-nowrap">Kolkata</strong>
              </div>
              <span className='text-[#5F828B] overflow-hidden text-ellipsis whitespace-nowrap'>{cityTemps.Kolkata}°</span>
            </li>
          </ul>
        </aside>


        {/* Today's Highlights */}
        <article className="border border-[#102630] text-[#5F828B] bg-linear-to-r from-[#0A1E25] shadow-xl/30 rounded-2xl p-6">
          <h2 className="text-lg text-white mb-4"><strong>Today's Highlights</strong></h2>
          <span className='flex justify-between'>
            <p>Feels like</p>
            <p>{FeelsLike}°</p>
          </span>
          <span className='flex justify-between'>
            <p>Humidity</p>
            <p>{Humidity}%</p>
          </span>
          <span className='flex justify-between'>
            <p>Wind direction</p>
            <p> {WindDir} </p>
          </span>
        </article>

        {/* Summary Section */}

        <section className="border border-[#102630]  bg-linear-to-r from-[#0A1E25] shadow-xl/30 rounded-2xl p-6 md:col-span-2 grid grid-cols-3 gap-4">
          <article className='flex text-[#5F828B] flex-col items-center'>
            <img width={100} src="./src/assets/cloud.png" alt="" />
            <p className="text-sm font-semibold">Cloud: {cloud}%</p>
          </article>
          <article className='flex flex-col text-[#5F828B] items-center'>
            <img width={100} src="src/assets/sunrise.png" alt="" />
            <p className="text-[15px] font-bold"> Sunrise: {sunrise}</p>
          </article>
          <article className='flex flex-col text-[#5F828B] items-center'>
            <img width={100} src="src/assets/sunset.png" alt="" />
            <p className="text-[15px] font-bold">Sunset: {sunset}</p>
          </article>
        </section>

        {/* Climate estimate */}
        <section className="border border-[#102630] bg-linear-to-r from-[#0A1E25] shadow-xl/30 rounded-2xl p-6">
          <h2 className="text-lg text-white mb-4"><strong>Climate estimate</strong></h2>
          <ul className="text-sm text-[#5F828B] space-y-2">
            <li className='flex justify-between'>
              <p>Min Temp</p>
              <span>{min_temp}</span>
            </li>
            <li className='flex justify-between'>
              <p>Max Temp</p>
              <span>{max_temp}</span>
            </li>
            <li className='flex justify-between'>
              <p>Precipitation</p>
              <span>{precip}</span>
            </li>
          </ul>
        </section>

        {/* Hourly Summary */}
        <section className="border border-[#102630] bg-linear-to-r from-[#0A1E25] shadow-xl/30 rounded-2xl p-6 md:col-span-4">
          <h2 className="text-lg text-white mb-4"><strong>Summary</strong></h2>
          <section className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-[#1B263B] pr-2 pb-2">
            {HourlyData && HourlySum(HourlyData)}
          </section>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
