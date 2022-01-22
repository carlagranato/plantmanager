import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Alert, ScrollView } from 'react-native';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Header } from '../components/header';
import { PlantCardSecondary } from '../components/plantCardSecondary';
import { Load } from '../components/load';

import waterdrop from '../assets/waterdrop.png'
import colors from '../styles/colors';
import fonts from '../styles/fonts';


export function MyPlants(){
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    function handleRemove(plant: PlantProps){
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😥',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) => (
                            oldData.filter((item) => item.id != plant.id)
                        ));

                    } catch (error) {
                        Alert.alert('Não foi possível remover! 😥')
                    }  
                }
            }
        ])
    }

    useEffect(() => {
        async function loadStorageData(){
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance( //formatDistance calcula a distancia de uma data pra outra
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: ptBR }  //Nossa formatação de data
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`
            )
            
            setMyPlants(plantsStoraged);
            setLoading(false);
        }
        
        loadStorageData();

    }, [])

    if (loading)
        return <Load /> 

    return (
        /* <ScrollView
            showsVerticalScrollIndicator={false}
        > */
            <View style={styles.container}>
                <Header />

                <View style={styles.spotlight}>

                    <Image 
                        source={waterdrop}
                        style={styles.spotlightImage}
                    />

                    <Text style={styles.spotlighText}>
                        {nextWatered}
                    </Text>

                </View>

                <View style={styles.plants}>

                    <Text style={styles.plantsTitle}>
                        Próximas regadas
                    </Text>

                    <FlatList data={myPlants} 
                        keyExtractor={(item) => String(item.id)} 
                        nestedScrollEnabled //usei essa propriedade no lugar no ScrollView, pois o ScrollView não comporta uma Flalist
                        renderItem={({item}) => (
                            <PlantCardSecondary 
                            data={item} 
                            handleRemove={() => {handleRemove(item)}}
                            />
                    )}
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{flex: 1}}
                    />
                </View> 
                        
            </View>
        // </ScrollView> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        backgroundColor: colors.background,

    },

    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },

    spotlightImage: {
        width: 60,
        height: 60
    },

    spotlighText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },

    plants: {
        flex: 1,
        width: '100%'
    },

    plantsTitle: {
        fontSize: 24,
        color: colors.heading,
        marginVertical: 25
    }


})