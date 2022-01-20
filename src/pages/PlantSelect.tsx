import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ActivityIndicatorBase } from "react-native";
import { EnvironmentButton } from "../components/environmentButton";
import { Header } from "../components/header";
import { PlantCardPrimary } from "../components/plantCardPrimary";
import { Load } from '../components/load';
import api from "../services/api";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnvironmentProps {
    key: string;
    title: string;
}

interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    }
}

export function PlantSelect(){
    const [Environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [Plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setfilteredPlants] = useState<PlantProps[]>([]);
    const [environmentsSelected, setenvironmentsSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadedAll, setLoadedAll] = useState(false);

    function handleEnvironmentsSelected(environment : string){
        setenvironmentsSelected(environment);

        if(environment === 'all')
            return setfilteredPlants(Plants);

        const filtered = Plants.filter(Plant =>
            Plant.environments.includes(environment)
        );

        setfilteredPlants(filtered);
    }

    async function fecthPlants() {
        const { data } = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`);

        if (!data)
            return setLoading(true);

        if (page > 1) {
            setPlants(oldValue => [...oldValue, ...data])
            setfilteredPlants(oldValue => [...oldValue, ...data])
        } else {
            setPlants(data);
            setfilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    useEffect(() => {
        fecthPlants();
    }, []);
 
    function handleFetchMore(distance: number) {
        if (distance < 1)
            return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fecthPlants();
    }

    useEffect(() => {
        async function fetchEnvironment() {
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fetchEnvironment();

    }, [])


    if (loading)
        return <Load /> 

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}> Em qual ambiente</Text>
                <Text style={styles.subtitle}> você quer colocar sua planta?</Text>
            </View>
            <View>
                <FlatList data={Environments} renderItem={({ item }) => ( 
                    <EnvironmentButton title={item.title} 
                    active={item.key === environmentsSelected} 
                    onPress={() => handleEnvironmentsSelected(item.key)}
                    />

                )} 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.environmentList}  />

            </View>
            <View style={styles.plants}>
                <FlatList data={filteredPlants} renderItem={({ item }) => (
                    <PlantCardPrimary data={ item } /> 
                )}
                showsVerticalScrollIndicator={false} 
                numColumns={2}
                onEndReachedThreshold={0.1} 
                onEndReached={({distanceFromEnd}) => 
                    handleFetchMore(distanceFromEnd) }
                ListFooterComponent={
                    loadingMore
                    ? <ActivityIndicator color={colors.green} />
                    : <></> //Podemos escrever null tbm, funciona igual
                }
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },

    header: {
        paddingHorizontal: 30

    },

    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },

    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },

    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },

    plants :{
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
});

export default PlantSelect;