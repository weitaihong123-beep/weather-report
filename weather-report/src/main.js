import './style.css'
import { weathercode } from './weathercode'
//console.log(weathercode[1]["day"])//为什么这里可以索引，它不是对象吗


//没写await和async为什么是报错而不是等待Uncaught TypeError: response.json is not a function
const display = document.getElementById("temperature")
const input = document.getElementById("input")
const button = document.getElementById("button")
const image = document.getElementById("weather-report")
let city;
let weather;
//获取经纬度
async function getCoords(params) {
  if (!(input.value === "")) { city = input.value }
  else {
    display.textContent = "重新输入城市"
    return {}

  }
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
    if (!response.ok) {
      display.textContent = "加载失败" + response.status
      return

    };
    const data = await response.json()
    if (!data.results) {
      display.textContent = "该城市不存在"
      return

    }
    const { latitude, longitude, name } = data.results[0];
    return { latitude, longitude, name }


  }
  catch (reason) {
    display.textContent = "网络错误" + reason

  }
}

//获取天气
async function getWeather(latitude,longitude,name) {
  let data = getCoords()
  try {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    if (!weatherResponse.ok) {
      display.textContent = "加载失败" + weatherResponse.status
      return

    };
    const weatherdata = await weatherResponse.json()
    const {temperature,windspeed,weathercode,is_day}=weatherdata.current_weather
    if (weathercode[weatherdata.current_weather.weathercode]) {
      if (weatherdata.current_weather.is_day === 1) {
        weather = weathercode[weatherdata.current_weather.weathercode].day.description
        image.src = weathercode[weatherdata.current_weather.weathercode].day.image
      }
      else {
        weather = weathercode[weatherdata.current_weather.weathercode].night.description
        image.src = weathercode[weatherdata.current_weather.weathercode].night.image

      }
      return{temperature,windspeed,weathercode,is_day}
    }
    else {
      weather = "未知"
    }
    display.textContent = `地名：${name}温度：${weatherdata.current_weather.temperature} 风速：${weatherdata.current_weather.windspeed} 天气：${weather}`
  }



  catch (reason) {
    display.textContent = "网络错误" + reason

  }
  
}

async function weatherTemperature(params) {
  display.textContent = "loading......"
  if (!(input.value === "")) { city = input.value }
  else {
    display.textContent = "重新输入城市"
    return {}

  }

  try {



    // display.textContent = `纬度${data.results[0].latitude} 经度${data.results[0].longitude}  地名${data.results[0].name}`
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&current_weather=true`)
    if (!weatherResponse.ok) {
      display.textContent = "加载失败" + weatherResponse.status
      return

    };
    const weatherdata = await weatherResponse.json()
    if (weathercode[weatherdata.current_weather.weathercode]) {
      if (weatherdata.current_weather.is_day === 1) {
        weather = weathercode[weatherdata.current_weather.weathercode].day.description
        image.src = weathercode[weatherdata.current_weather.weathercode].day.image
      }
      else {
        weather = weathercode[weatherdata.current_weather.weathercode].night.description
        image.src = weathercode[weatherdata.current_weather.weathercode].night.image

      }
    }
    else {
      weather = "未知"
    }
    display.textContent = `地名：${data.results[0].name}温度：${weatherdata.current_weather.temperature} 风速：${weatherdata.current_weather.windspeed} 天气：${weather}`

  }
  catch (reason) {
    display.textContent = "网络错误" + reason


  }
}
button.addEventListener("click", weatherTemperature)


