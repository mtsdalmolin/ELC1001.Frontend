import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, FlatList, Dimensions, PermissionsAndroid, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Weather from '../components/Weather'

import camisas from '../assets/images/camisas.png'
import calcas from '../assets/images/calça.png'

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

export default function MainMenu ({ navigation }) {
    const [dayPhrase, setDayPhrase] = useState('')
    const [tomorrowWeather, setTomorrowWeather] = useState(false)

    async function getTokenFromStorage() {
        const token = await AsyncStorage.getItem('@Baloo:token');
        console.log("TOKEN MAIN MENU: " + token)
        return token
    }

    useEffect(() => {
        const token = getTokenFromStorage()

        if (token === null) 
            navigation.navigate('Login')
    }, [])
    
    async function storeLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
        
            if (granted === PermissionsAndroid.RESULTS.GRANTED)
                await AsyncStorage.setItem('@Baloo:locationPermission', granted);

        } catch (err) {
            console.warn(err)
        }
    }

    useEffect(() => {
        storeLocationPermission()
    }, [])

    const buttonItem = ({item}) => {
        return (
            <View>
                <TouchableOpacity onPress={() => navigation.navigate(`${item.target}`)}>
                    { item.icon() }
                </TouchableOpacity>
                <Text style={styles.optionText}>{item.text}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.dayStatus}>
                <View style={styles.weather}>
                    <TouchableOpacity style={styles.centerThings} onPress={() => setTomorrowWeather(false)}>
                        {
                            tomorrowWeather && <MaterialCommunityIcons
                                size={20}
                                name="arrow-left"
                                color="#4E3D42"
                            />
                        }
                        <Text style={styles.text}>HOJE</Text>
                    </TouchableOpacity>
                    {tomorrowWeather ? (<Weather setDayPhrase={setDayPhrase} tomorrowWeather />) : (<Weather setDayPhrase={setDayPhrase} />)}
                </View>
                <View style={styles.centerThings}>
                    <TouchableOpacity style={styles.centerThings} onPress={() => setTomorrowWeather(true)}>
                        <Text style={{ ...styles.text, color: '#d4a1c1' }}>AMANHÃ</Text>
                        {
                            !tomorrowWeather && <MaterialCommunityIcons
                                size={20}
                                name="arrow-right"
                                color="#d4a1c1"
                            />
                        }
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.dayPhrase}>{ dayPhrase ? dayPhrase : 'Mensagem alternativa, API com problemas' }</Text>
            
            <View style={styles.middle}>
                {/* O que colocar na ações desses botoes? Deixei apenas como imagem, por enquanto */}
                <ImageBackground source={camisas} style={styles.middleCard} imageStyle={styles.imageStyle} />
                <ImageBackground source={calcas} style={styles.middleCard} imageStyle={styles.imageStyle} />
            </View>
            
            <View style={styles.options}>
                <FlatList
                    data={buttonsList}
                    renderItem={buttonItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                />
            </View>
        </View>
    )
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
        fontWeight: 'bold',
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
        paddingHorizontal: 15
    },
    dayPhrase: {
        backgroundColor: 'pink',
        color: 'white',
        fontSize: 18,
        fontFamily: 'Rubik',
        textAlign: 'center',
        paddingVertical: 5
    },
    weather: {
        flexDirection: 'row',
        paddingBottom: 5,
        display: 'flex',
        alignItems: 'center'
    },
    centerThings: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})