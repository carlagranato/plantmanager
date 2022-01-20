import React, { useEffect, useState }from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import colors from '../styles/colors';
import userImg from '../assets/carla.png'
import fonts from '../styles/fonts';

export function Header(){
    const [userName, setUserName] = useState<string>();

    useEffect(() => {
        async function loadStorageUserName() {
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');

        }

        loadStorageUserName();

    }, [] ); //Toda vez que o userName mudar, esse useEffect será recarregado. Quando não tem nada no vetor, ele carrega uma vez só

    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.userName}>
                    {userName}
                </Text>
            </View>

            <Image source={userImg} style={styles.image} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: getStatusBarHeight()
    },

    image:{
        width: 70,
        height: 70,
        borderRadius: 40,
        
    },

    greeting: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },

    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40
    },

   

});