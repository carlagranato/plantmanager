import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Jost_100Thin } from "@expo-google-fonts/jost";

export interface PlantProps { //Para tirar a repetição dessa interface em duas telas diferentes. Assim só chamamos quando necessário
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    },
    dateTimeNotification: Date;
}

interface StoragePlantPropos {

    [id: string]: {
        data: PlantProps;
    }
}

export async function savePlant(plant: PlantProps) : Promise<void> {
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const oldPlants = data ? (JSON.parse(data) as StoragePlantPropos) : {};
        
        const newPlant = {
            [plant.id]: {
                data : plant
            }
        }

    await AsyncStorage.setItem('@plantmanager:plants', 
    JSON.stringify({
        ...newPlant,
        ...oldPlants
    }));    

    }catch (error) {
        throw new Error('error');        

    }

}

export async function loadPlant() : Promise<PlantProps[]> {
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const plants = data ? (JSON.parse(data) as StoragePlantPropos) : {};
        
        const PlantsSorted = Object
        .keys(plants)
        .map((plant) => {
            return {
                ...plants[plant].data,
                hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
            }
        })
        .sort((a, b) => 
            Math.floor(
                new Date(a.dateTimeNotification).getTime() / 1000 - 
                Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
            )
        );

        return PlantsSorted;


    }catch (error) {
        throw new Error('error');        

    }

}