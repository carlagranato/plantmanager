import React from 'react';
import { Alert, StyleSheet, View, Text, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import waterdrop from '../assets/waterdrop.png'
import { Button } from '../components/button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';


export function PlantSave(){
    return(
        <View style={styles.container}>
            <View style={styles.plantInfo}>
                <SvgFromUri
                    uri=''
                    height={150}
                    width={150}
                />

                <Text style={styles.plantName}>
                    Nome da planta
                </Text>
                <Text style={styles.plantAbout}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
            </View>

            <View style={styles.controller}>
                <View style={styles.tipContainer}>
                    <Image 
                    source={waterdrop}
                    style={styles.tipImage}
                    />

                    <Text style={styles.tipText}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </Text>

                </View>

                <Text style={styles.alertLabel}>
                    Escolha o melhor horário para ser lembrado:
                </Text>

                <Button 
                title='Cadastrar planta'
                onPress={() => {}}  //onPress={() => {}} é um onPress que não faz nada
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape,

    },

    plantName: {

    },

    plantAbout: {

    },

    controller: {

    },

    tipContainer: {

    }
})