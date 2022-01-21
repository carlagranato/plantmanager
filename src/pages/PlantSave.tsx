import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core'; //com useRoute conseguimos recuperar valores através da nossa rota
import { getBottomSpace } from 'react-native-iphone-x-helper';
import DateTimePicker , { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { SvgFromUri } from 'react-native-svg';
import { loadPlant, PlantProps, savePlant } from '../libs/storage';
import waterdrop from '../assets/waterdrop.png'
import { Button } from '../components/button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface Params {
    plant: PlantProps
}

export function PlantSave(){
    const [selectedeDateTime, setSelectedeDateTime] = useState(new Date());
    const [showDatePicker, setshowDatePicker] = useState(Platform.OS == 'ios');

    const route = useRoute();
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    function handleChangeTime(_: Event, dateTime: Date | undefined ){
        if (Platform.OS == 'android'){
            setshowDatePicker(oldState => !oldState);

        }

        if(dateTime && isBefore(dateTime, new Date())){ //verifica se a hora seleciona é anterior à hora atual
            setSelectedeDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro ⏰');
        }

        if(dateTime)
            setSelectedeDateTime(dateTime);
        
    }

    function handleOpenDateTimePickerForAndroid(){
        setshowDatePicker(oldState => !oldState);
    }
  
    async function handleSave(){
             
        try {

            await savePlant({
                ...plant,
                dateTimeNotification: selectedeDateTime
            });

            navigation.navigate('Confirmation', {          
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado',
                buttonTitle: 'Muito obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlants',
            });

        }catch {
            Alert.alert ('Não foi possível salvar 😥')
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.plantInfo}>
                <SvgFromUri
                    uri={plant.photo}
                    height={150}
                    width={150}
                />

                <Text style={styles.plantName}>
                    {plant.name}
                </Text>
                <Text style={styles.plantAbout}>
                    {plant.about}
                </Text>
            </View>

            <View style={styles.controller}>
                <View style={styles.tipContainer}>
                    <Image 
                    source={waterdrop}
                    style={styles.tipImage}
                    />

                    <Text style={styles.tipText}>
                        {plant.water_tips}
                    </Text>

                </View>

                <Text style={styles.alertLabel}>
                    Escolha o melhor horário para ser lembrado:
                </Text>

                {showDatePicker && ( //Verifica se vai ser iOS, e executa apenas se for verdadeiro
                    <DateTimePicker 
                        value={selectedeDateTime}
                        mode='time'
                        display='spinner'
                        onChange={handleChangeTime}
                    />
                )}

                {
                    Platform.OS === 'android' && (
                    
                        <TouchableOpacity
                            style={styles.dateTimePickerButton} 
                            onPress={handleOpenDateTimePickerForAndroid}>
                            <Text style={styles.datetimePickerText}>
                                {`Mudar ${format(selectedeDateTime, 'HH:mm')}`}
                            </Text>
                        </TouchableOpacity>
                        )
                }
                

                <Button 
                title='Cadastrar planta'
                onPress={handleSave}  //onPress={() => {}} é um onPress que não faz nada
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape

    },

    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },

    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20 //o getBottomSpace pega o espaço da tela do iPhone, mas caso seja um Android ele usa 20pixels
    },

    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15,
    },

    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },

    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60 //Conta de baixo pra cima, qual será a posição do componente (já que informamos acima que é relativa)
    },

    tipImage: {
        height: 56,
        width: 56
    },

    tipText: {
        flex:1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },

    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },

    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,

    },

    datetimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    }
})