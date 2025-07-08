import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import * as Location from 'expo-location';
import { LoaderSpinner } from '../commom/LoaderSpinner';
import MapView, { Marker } from 'react-native-maps';
import TextInput from '../commom/TextInput';
import { Entypo } from '@expo/vector-icons';
import DefaultButton from '../commom/DefaultButton';
import { CoordsAddress, CoordsPoint } from '../../types/coords';
import { geocodeAddress, getRegionForCoordinates, reverseGeocodeCoords } from '../../lib/location';

type Props = {
    location: Location.LocationObjectCoords | null;
    setLocation: (loc: Location.LocationObjectCoords) => void;
    starterPoint: CoordsAddress | null;
    setStarterPoint: (point: CoordsAddress) => void;
    destinationCoords?: CoordsPoint | null;
};

const MapCreateTravel = (props: Props) => {
    const { location, setLocation, starterPoint, setStarterPoint, destinationCoords } = props;
    const [address, setAddress] = React.useState(starterPoint?.address || "");
    const [region, setRegion] = React.useState({
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const mapRef = React.useRef<MapView>(null);

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
                const address = await reverseGeocodeCoords(loc.coords);
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

    useEffect(() => {
        if (starterPoint && destinationCoords) {
            const newRegion = getRegionForCoordinates([starterPoint, destinationCoords]);
            if (newRegion) setRegion(newRegion);
        } else if (starterPoint) {
            setRegion({
                latitude: starterPoint.latitude,
                longitude: starterPoint.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [starterPoint, destinationCoords]);

    const handleMapPress = async (event: any) => {

        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log("Coordenadas selecionadas:", latitude, longitude);
        const address = await reverseGeocodeCoords({ latitude, longitude });
        setStarterPoint({ latitude, longitude, address });
    };

    const handleSearchLocation = async (address: string) => {
        if (!address) return;
        console.log("Buscando localização para o endereço:", address);
        const coords = await geocodeAddress(address);
        if (coords) {
            console.log("Localização geocodificada:", coords.latitude, coords.longitude);
            setLocation({ ...coords, accuracy: 0 } as Location.LocationObjectCoords);
            setStarterPoint({ ...coords, address });
        } else {
            console.log("Nenhuma localização encontrada para o endereço:", address);
        }
    };


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
                ref={mapRef}
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

                {destinationCoords && (
                    <Marker
                        coordinate={destinationCoords}
                        title="Destino"
                        description="Local do destino da viagem"
                        pinColor="red"
                    />
                )}


            </MapView>
        </View>
    )
}

export default MapCreateTravel