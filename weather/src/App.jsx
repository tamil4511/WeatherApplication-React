import React, { useEffect, useState } from 'react';
import './App.css';
// this is for import images from the assert folder
import clearsun from './assets/clear_sun.jpeg';
import cloudsun from './assets/cloud_sun.jpg';
import cloud from './assets/cloud.jpg';
import humidity from './assets/icons8-humidity-64.png';
import rain from './assets/rain.jpeg';
import search from './assets/icons8-search-64.png';
import snow from './assets/snow.png';
import wind from './assets/icons8-wind-100.png';
import sunrain from './assets/sun_rain.jpeg';
import propTypes from 'prop-types';
// this return the data of the weather
const WeatherData = ({icon,temp,city,country,latitude,longitude,windspeed,humiditypercent}) => {
  return (
    <>
    <div className="image">
      <img src={icon} alt="Image" />
    </div>
    <div className="temp">
      {temp}*C
    </div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">latitude</span>
        <span>{latitude}</span>
      </div>
      <div>
        <span className="long">longitude</span>
        <span>{longitude}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidity} alt="humidity" className='icon'/>
        <div className="data">
          <div className="humidity-percent">{humiditypercent}%</div>
        <div className='text'>humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={wind} alt="wind" className='icon'/>
        <div className="data">
          <div className="wind-percent">{windspeed} Km/h</div>
        <div className='text'>wind speed</div>
        </div>
        
      </div>
    </div>
    </>
  );
};
//this api key
const api_key="ad2ed3f0fe6835b1210cce0fce9402e5";

function App() {
  //this usestate set the values
  const [cityname,setcityname]=useState('namakkal');
  const [icon,seticon]=useState(clearsun);
  const [temp,settemp]=useState(30);
  const [city,setcity]=useState('Namakkal');
  const [country,setcountry]=useState('India');
  const [latitude,setlatitude]=useState('19.0760');
  const [longitude,setlongitude]=useState('72.8777');
  const [humiditypercent,sethumiditypercent]=useState('56');
  const [windspeed,setwindspeed]=useState('50');
  const [citynotfound,setcitynotfound]=useState(false);
  const [loading,setloading]=useState(false);
  const [error,seterror]=useState('');
  
  //this for set the image for related code
  const weatherIconMap={
    "01d":clearsun,
    "01n":clearsun,
    "02d":cloudsun,
    "02n":cloudsun,
    "03d":cloud,
    "03n":cloud,
    "04d":cloud,
    "04n":cloud,
    "09d":rain,
    "09n":rain,
    "10d":sunrain,
    "10n":sunrain,
    "11d":rain,
    "11n":rain,
    "13d":snow,
    "13n":snow,
    "50d":cloud,
    "50n":cloud,
  };
//this set the value to the usestate
const handleCity=(e)=>
{
  setcityname(e.target.value);
};

  const searching=async()=>{
    setloading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${api_key}&units=Metric`;

    try{
      let res=await fetch(url);
      let data=await res.json();//set the data as readable format
      // console.log(data);
      if(data.cod==404)
      {
        console.error('City not found'); // this error message for setting the city not found or any errors
        setcitynotfound(true);
        setloading(false);
        return;
      }
      sethumiditypercent(data.main.humidity);
      setwindspeed(data.wind.speed);
      settemp(Math.floor(data.main.temp));
      setcity(data.name);   // this set the related data to the usestate
      setcountry(data.sys.country);
      setlatitude(data.coord.lat);
      setlongitude(data.coord.lon);
      setcitynotfound(false);
      seticon(weatherIconMap[data.weather[0].icon] || clearsun);
    }catch(error)
    {
      console.log(error);
      seterror('Something went wrong');
    }finally
    {
      setloading(false);
    }
    };





    const HandleKeyDown=(e)=>
    {
      if(e.key==='Enter') // this is for enter key press
      {
        searching();   
      }
    };


   useEffect(()=>{   // this is for initial render
    searching();
   },[]);
   
  return (
    <>
      <div className="container">
        <div className="inputcontainer">
          <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={cityname} onKeyDown={HandleKeyDown}/>
          <div className="search-icon" onClick={searching}>
            <img src={search} alt="search"  />
          </div>
        </div>
        {!loading && !citynotfound && !error && <WeatherData icon={icon} temp={temp} city={city} country={country} latitude={latitude} longitude={longitude} humidity={humiditypercent} windspeed={windspeed} humiditypercent={humiditypercent}/>}

        {loading && <div className="loading-message">loading...</div>}  {/* these three message only print when there is any error,city not found,loading */}
        {error && <div className="error-message">{error}</div>}
        {citynotfound && <div className="city-not-found">City not Found</div>}
      </div>
      
    </>
  );

  WeatherData.propTypes={  //this for checking the data type
    icon:propTypes.string.isRequired,
    temp:propTypes.number.isRequired,
    city:propTypes.string.isRequired,
    country:propTypes.string.isRequired,
    latitude:propTypes.number.isRequired,
    longitude:propTypes.number.isRequired,
    windspeed:propTypes.number.isRequired,
    humiditypercent:propTypes.number.isRequired,
  }

}

export default App
