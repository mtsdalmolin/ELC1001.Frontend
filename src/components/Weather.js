import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { weatherConditions } from '../assets/weatherConditions';

// TODO: Finalizar o componente com os ícones de cada tipo de retorno da API de clima

const Weather = ({ weather, temperature }) => {
    if (weather != null) {
        return (
            <View
                style={[
                    styles.weatherContainer,
                    { backgroundColor: weatherConditions[weather].color }
                ]}
            >
            <View style={styles.headerContainer}>
                <Text style={styles.tempText}>{temperature}˚</Text>
            </View>
                <View style={styles.bodyContainer}>
                    <Text style={styles.title}>{weatherConditions[weather].title}</Text>
                    <Text style={styles.subtitle}>
                        {weatherConditions[weather].subtitle}
                    </Text>
                </View>
            </View>
        )
    } else {
        return (
            <View>
                <Text>Oops!</Text>
            </View>
        )
    }
}

Weather.propTypes = {
  temperature: PropTypes.number.isRequired,
  weather: PropTypes.string
}

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tempText: {
    fontSize: 72,
    color: '#fff'
  },
  bodyContainer: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: 25,
    marginBottom: 40
  },
  title: {
    fontSize: 60,
    color: '#fff'
  },
  subtitle: {
    fontSize: 24,
    color: '#fff'
  }
})

export default Weather;