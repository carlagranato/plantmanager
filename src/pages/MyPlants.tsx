import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Header } from '../components/header';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants(){
    return (
        <View style={styles.container}>
            <Header />

            
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background,
        
    },

})