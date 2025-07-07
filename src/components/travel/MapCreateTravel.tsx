import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import * as Location from 'expo-location';
import { LoaderSpinner } from '../commom/LoaderSpinner';
import MapView, { Marker } from 'react-native-maps';
import TextInput from '../commom/TextInput';
import { Entypo } from '@expo/vector-icons';
import DefaultButton from '../commom/DefaultButton';
import { CoordsAddress, CoordsPoint } from '../../types/coords';

type Props = {
    location: Location.LocationObjectCoords | null;
    setLocation: (loc: Location.LocationObjectCoords) => void;
    starterPoint: CoordsAddress | null;
    setStarterPoint: (point: CoordsAddress) => void;
};

const MapCreateTravel = (props: Props) => {
    const { location, setLocation, starterPoint, setStarterPoint } = props;
    const [hasFetchedLocation, setHasFetchedLocation] = React.useState(false);
    const [address, setAddress] = React.useState(starterPoint?.address || "");
    const [region, setRegion] = React.useState({
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    useEffect(() => {

        if (!starterPoint) {

            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permissão negada para acessar localização');
                    return;
                }

                let loc = await Location.getCurrentPositionAsync({});
                console.log("Localização atual:", loc);
                setLocation(loc.coords);
                const address = await handleConvertCoordsToAddress(loc.coords);
                setStarterPoint({ ...loc.coords, address });
            })();
        }
    }, []);

    useEffect(() => {
        if (location) {
            setRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [location]);

    useEffect(() => {
        if (starterPoint) {
            setRegion({
                latitude: starterPoint.latitude,
                longitude: starterPoint.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [starterPoint]);

    const handleMapPress = async (event: any) => {

        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log("Coordenadas selecionadas:", latitude, longitude);
        const address = await handleConvertCoordsToAddress({ latitude, longitude });
        setStarterPoint({ latitude, longitude, address });
    };

    const handleSearchLocation = async (address: string) => {
        if (!address) return;
        console.log("Buscando localização para o endereço:", address);
        try {
            let geocoded = await Location.geocodeAsync(address);
            if (geocoded.length > 0) {
                const { latitude, longitude } = geocoded[0];
                console.log("Localização geocodificada:", latitude, longitude);
                setLocation({ latitude, longitude, accuracy: 0 } as Location.LocationObjectCoords);
                setStarterPoint({ latitude, longitude, address });
            } else {
                console.log("Nenhuma localização encontrada para o endereço:", address);
            }
        } catch (error) {
            console.error("Erro ao geocodificar o endereço:", error);
        }
    }

    const handleConvertCoordsToAddress = async (point: CoordsPoint): Promise<string> => {
        try {
            const [result] = await Location.reverseGeocodeAsync(point);
            if (result) {
                console.log("Endereço encontrado:", result);
                const address = `${result.street || result.name || ''}, ${result.subregion || result.region || result.city || ''}`;
                setAddress(address);
                return address;
            }
        } catch (error) {
            console.error("Erro ao converter coordenadas em endereço:", error);
        }
        return "";
    }

    if (!location) {
        return (
            <View className="flex-1 justify-center items-center">
                <LoaderSpinner message="Carregando localização..." />
            </View>
        );
    }
    return (
        <View style={{ flex: 1 }}>
            <View className='mb-4'>
                <TextInput
                    value={address}
                    setValue={setAddress}
                    label="Endereço de Origem"
                    placeholder="Digite seu endereço ou selecione no mapa"
                    iconLeft={<Entypo name="map" size={24} color="black" />}
                />
                <DefaultButton
                    btnText="Pesquisar Localização"
                    className='w-full mt-4'
                    onPress={() => handleSearchLocation(address)}
                />
            </View>
            <MapView
                style={{ flex: 1 }}
                region={region}
                onPress={handleMapPress}
                onRegionChangeComplete={setRegion}
                showsUserLocation
                showsMyLocationButton
            >


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