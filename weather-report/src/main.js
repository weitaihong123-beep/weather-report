import './style.css'
import { weathercodebiao } from './weathercode'
//console.log(weathercode[1]["day"])//为什么这里可以索引，它不是对象吗


//没写await和async为什么是报错而不是等待Uncaught TypeError: response.json is not a function
const display = document.getElementById("temperature")
const input = document.getElementById("input")
const button = document.getElementById("button")
const image = document.getElementById("weather-report")
let city;
let weather;
//获取经纬度
async function getCoords() {
  if (!(input.value === "")) { city = input.value }
  else {
    display.textContent = "重新输入城市"
    return

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
async function getWeather(latitude, longitude) {
  try {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    if (!weatherResponse.ok) {
      display.textContent = "加载失败" + weatherResponse.status
      return

    };
    const weatherdata = await weatherResponse.json()
    const { temperature, windspeed, weathercode, is_day } = weatherdata.current_weather

    return { temperature, windspeed, weathercode, is_day }
  }





  catch (reason) {
    display.textContent = "网络错误" + reason

  }

}

//渲染
function render(name, temperature, windspeed, weathercode, is_day) {
  if (weathercodebiao[weathercode]) {
    if (is_day === 1) {
      weather = weathercodebiao[weathercode].day.description
      image.src = weathercodebiao[weathercode].day.image
    }
    else {
      weather = weathercodebiao[weathercode].night.description
      image.src = weathercodebiao[weathercode].night.image

    }
  }
  else {
    weather = "未知"
  }
  display.textContent = `地名：${name}温度：${temperature} 风速：${windspeed} 天气：${weather}`


}

async function weatherTemperature() {
  display.textContent = "loading..."
  const 坐标 = await getCoords()
  if (!坐标){
    return
  }
  const 天气 = await getWeather(坐标.latitude, 坐标.longitude)
  if(!天气) return
  render(坐标.name, 天气.temperature, 天气.windspeed, 天气.weathercode, 天气.is_day)
}

button.addEventListener("click", weatherTemperature)


