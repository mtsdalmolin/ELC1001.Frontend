import axios from 'axios'

export default async function fetchWeather(lat, lon) {
    console.log(lat, lon)
    return await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=849338767c0e95025b5559533d26b7c4&units=metric`)
}
