import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import * as Location from 'expo-location';
import { LoaderSpinner } from '../commom/LoaderSpinner';
import MapView, { Marker } from 'react-native-maps';

type Props = {
    location: Location.LocationObjectCoords | null;
    setLocation: (loc: Location.LocationObjectCoords) => void;
    starterPoint: { latitude: number; longitude: number } | null;
    setStarterPoint: (point: { latitude: number; longitude: number }) => void;
};

const MapCreateTravel = (props: Props) => {
    const { location, setLocation, starterPoint, setStarterPoint } = props;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permissão negada para acessar localização');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            console.log("Localização atual:", loc);
            setLocation(loc.coords);
        })();
    }, []);

    const handleMapPress = (event: any) => {

        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log("Coordenadas selecionadas:", latitude, longitude);
        setStarterPoint({ latitude, longitude });
    };


    if (!location) {
        return (
            <View className="flex-1 justify-center items-center">
                <LoaderSpinner message="Carregando localização..." />
            </View>
        );
    }
    return (
        <View style={{ width: '100%', height: 200 }}>
            <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: location?.latitude || 0,
                    longitude: location?.longitude || 0,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
            >
                <Marker
                    coordinate={{
                        latitude: location?.latitude || 0,
                        longitude: location?.longitude || 0,
                    }}
                    title="Localização Atual"
                    description="Você está aqui"
                />

                {starterPoint && (
                    <Marker
                        coordinate={starterPoint}
                        title="Ponto de Partida"
                        description="Ponto onde a viagem começará"
                        pinColor="blue"
                    />
                )}
            </MapView>
        </View>
    )
}

export default MapCreateTravel