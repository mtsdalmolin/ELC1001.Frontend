import axios from 'axios'

export async function fetchWeather(lat, lon, unixTime) {
    return await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=c1d170a90692f386f9653611fe79af6b&units=metric${unixTime ? '&dt=' + unixTime : ''}`
    )
}
