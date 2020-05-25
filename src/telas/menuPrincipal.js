import React, { Component, useEffect, useState } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, FlatList, Dimensions, Platform, PermissionsAndroid } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from '@react-native-community/geolocation';

import { WeatherConditions } from '../assets/weatherConditions'
import { fetchWeather } from '../services/weatherApi'

import Weather from '../components/Weather'

import looks from '../assets/images/looks.jpeg'
// import calendar from '../assets/images/calendar.jpeg' 
import comporlook from '../assets/images/comporlook.jpeg'
import LooksIcon from '../assets/icons/looks.svg'
import ComporLookIcon from '../assets/icons/comporlook.svg'
import CalendarIcon from '../assets/icons/calendario.svg'
import TradeSpaceIcon from '../assets/icons/espacotroca.svg'

const WIDTH = Dimensions.get('window').width

const buttonsList = [{
    text: 'looks',
    target: 'Looks',
    icon: () => (<LooksIcon style={styles.buttonItem} />)
},{
    text: 'compor look',
    target: 'ComporLook',
    icon: () => (<ComporLookIcon style={styles.buttonItem} />)
},{
    text: 'espaço troca',
    target: 'EspacoTroca',
    icon: () => (<TradeSpaceIcon style={styles.buttonItem} />)
},{
    text: 'calendário',
    target: 'Calendar',
    icon: () => (<CalendarIcon style={styles.buttonItem} />)
},]

export default class MainMenu extends Component {
    state = {
        isLoading: true,
        temperature: 0,
        weatherCondition: null,
        error: null,
        initialPosition: 'unknown',
        lastPosition: 'unknown'
    }

    // TODO: Finalizar a comunicação com a api do tempo e mostrar na tela inicial

    async componentDidMount() {
        // Geolocation.getCurrentPosition(
        //     async position => {
        //         // console.log('position',position)
        //         let weather = await fetchWeather(position.coords.latitude, position.coords.longitude)
        //         this.setState({
        //             temperature: json.main.temp,
        //             weatherCondition: json.weather[0].main,
        //             isLoading: false
        //         })
        //     },
        //     error => {
        //         this.setState({
        //             error: 'Error Getting Weather Condtions'
        //         })
        //     }
        // )
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
        }

        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = JSON.stringify(position);
                this.setState({initialPosition});
            },
            error => console.log(error),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        )
    }

    async UNSAFE_componentWillMount(){
        
        const token = await AsyncStorage.getItem('@Baloo:token');
        console.log("TOKEN MAIN MENU: " + token)
    
        if (token === null) 
        this.props.navigation.navigate('Login')

    }

    _buttonItem = ({item}) => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate(`${item.target}`)}>
                    { item.icon() }
                </TouchableOpacity>
                <Text style={styles.optionText}>{item.text}</Text>
            </View>
        )
    }

    render() {
        {/* TODO: Utilizar os estados abaixo para mostrar o clima ou um gif enquanto a resposta da api não retorna */}
        const { isLoading, weatherCondition, temperature } = this.state;
        return(
            <View style={styles.container}>
                <View style={styles.dayStatus}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(`${item.target}`)}>
                            <Text style={styles.text}>HOJE</Text>
                            <Weather weather={weatherCondition} temperature={temperature} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.text}>AMANHÃ ></Text>
                    </View>
                </View>

                <Text style={styles.dayPhrase}>Dia nublado, que tal ser um ponto de cor?</Text>
                
                <View style={styles.middle}>
                    {/* O que colocar na ações desses botoes? Deixei apenas como imagem, por enquanto */}
                    <ImageBackground source={looks} style={styles.middleCard} imageStyle={styles.imageStyle} />
                    <ImageBackground source={comporlook} style={styles.middleCard} imageStyle={styles.imageStyle} />
                </View>
                
                <View style={styles.options}>
                    {/* O ícone do botão espaço troca está diferente dos outros. Não mexi porque não vale a pena estilizar apenas um */}
                    <FlatList
                        data={buttonsList}
                        renderItem={this._buttonItem}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    middleCard: {
        width: WIDTH / 2 - 20,
        margin: 10,
        height: 'auto'
    },
    middle: {
        flex: 1,
        flexDirection: 'row'
    },
    options: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightpink'
    },
    optionText: {
        fontSize: 15,
        color: "#4E3D42",
        fontWeight: 'bold',
        alignSelf: "center",
        margin: 3,
        fontFamily: "Rubik",
    },
    buttonItem: {
        alignItems:'center',
        justifyContent:'center',
        width:65,
        height:65,
        borderRadius:50,
        marginHorizontal: 50,
        marginTop: 10,
        marginBottom: 0
    },
    text: {
        fontSize: 20,
        color: "#4E3D42",
        alignSelf: "center",
        margin: 3,
        fontFamily: "Rubik",
    },
    imageStyle: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 20,
    },
    dayStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 45,
        fontFamily: 'Rubik',
        paddingHorizontal: 25
    },
    dayPhrase: {
        backgroundColor: 'pink',
        color: 'white',
        fontSize: 20,
        fontFamily: 'Rubik',
        textAlign: 'center'
    }
})