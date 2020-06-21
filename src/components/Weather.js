import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, PermissionsAndroid, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { weatherConditions } from '../assets/weatherConditions'
import Geolocation from '@react-native-community/geolocation'
import { fetchWeather } from '../services/weatherApi'

const Weather = ({ setDayPhrase, tomorrowWeather }) => {
  const [hasLocationPermission, setHasLocationPermission] = useState('')
  const [userPosition, setUserPosition] = useState(false)
  const [weather, setWeather] = useState(null)

  async function verifyLocationPermission() {
    const permission = await AsyncStorage.getItem('@Baloo:locationPermission')
    setHasLocationPermission(permission)
  }

  useEffect(() => {
    verifyLocationPermission()

    if (hasLocationPermission === PermissionsAndroid.RESULTS.GRANTED)
      Geolocation.getCurrentPosition(
        position => {
          setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        error => Alert.alert(error.code, JSON.stringify(error.message)),
      )
  }, [hasLocationPermission])

  useEffect(() => {
    async function getWeather() {
      try {
        let response
        if (tomorrowWeather) {
          let today = new Date()
          let tomorrow = new Date()
          tomorrow.setDate(today.getDate() + 1)

          response = await fetchWeather(userPosition.latitude, userPosition.longitude, tomorrow.getTime())
        } else {
          response = await fetchWeather(userPosition.latitude, userPosition.longitude)
        }
        
        setWeather(response.data)
      } catch (error) {
        Alert.alert(error.code, JSON.stringify(error.message))
      }
    }

    getWeather()
  }, [userPosition, tomorrowWeather])

  weather && setDayPhrase(weatherConditions[weather.weather[0].main].message)

  if (weather !== null) {
    return (
      <>
        <View style={styles.tempContainer}>
          <Text style={styles.tempText}>{weather.main.temp.toFixed(1)}˚</Text>
          <Text>temperatura</Text>
          <Text style={styles.tempMaxText}>máx {weather.main.temp_max.toFixed(1)}˚</Text>
        </View>
        <View>
          {weather.weather ? 
            <MaterialCommunityIcons
              size={58}
              name={weatherConditions[weather.weather[0].main].icon}
              color={weatherConditions[weather.weather[0].main].color}
            /> 
          :
            <MaterialCommunityIcons
              size={58}
              name="weather-sunset"
              color="#c9710a"
            />
          }
        </View>
      </>
    )
  } else {
    return (
      <View style={styles.tempContainer}>
        <Text>Oops!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tempText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Rubik'
  },
  tempMaxText: {
    fontSize: 10,
    fontFamily: 'Rubik',
    color: 'pink'
  },
  tempContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2
  }
})

export default Weather;