import { useState, useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { socket } from "../services/socket";

import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getTravelById, updateTravelStatus } from "../services/travelService";
import { TravelAPIResponseType } from "../types/travel";

import { useMotoristaLocation } from "../context/TravelContext";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TravelProgress"
>;

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_APIKEY_MAPS;

type TravelRequestsRouteProp = RouteProp<RootStackParamList, "TravelProgress">;

export default function TravelProgress() {
  const route = useRoute<TravelRequestsRouteProp>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { id } = route.params;

  const [viagem, setViagem] = useState<TravelAPIResponseType | null>(null);
  const { location: motoristaLocalizacao, setLocation: setMotoristaLocalizacao } = useMotoristaLocation();

  const [viagemIniciada, setViagemIniciada] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const fetchViagem = async () => {
      try {
        const data = await getTravelById(id);
        setViagem(data);

        setViagemIniciada(data.status === "andamento");
      } catch {
        Alert.alert("Erro ao buscar dados da viagem");
      }
    };

    fetchViagem();

    socket.connect();
    socket.emit("entrarViagem", id);

    socket.on("motorista:atualizacao", ({ latitude, longitude }) => {
      setMotoristaLocalizacao({ latitude, longitude });
    });

    return () => {
      socket.off("motorista:atualizacao");
      socket.disconnect();
    };
  }, [id]);

  const iniciarViagem = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada para acessar localização.");
      return;
    }

    try {
      setLoadingStatus(true);
      await updateTravelStatus(id, "andamento");
      setViagemIniciada(true);
    } catch {
      Alert.alert("Erro ao iniciar viagem.");
      return;
    } finally {
      setLoadingStatus(false);
    }

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
      (localizacao) => {
        const { latitude, longitude } = localizacao.coords;
        socket.emit("motorista:localizacao", { viagemId: id, latitude, longitude });
        setMotoristaLocalizacao({ latitude, longitude });
      }
    );
  };

  const finalizarViagem = async () => {
    try {
      setLoadingStatus(true);
      await updateTravelStatus(id, "finalizada");
      setViagemIniciada(false);
      Alert.alert("Viagem finalizada com sucesso!");
      navigation.goBack()
    } catch {
      Alert.alert("Erro ao finalizar viagem.");
    } finally {
      setLoadingStatus(false);
    }
  };

  if (!viagem) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Carregando viagem...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: viagem.origem_lat,
          longitude: viagem.origem_long,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Origem */}
        <Marker
          coordinate={{ latitude: viagem.origem_lat, longitude: viagem.origem_long }}
          title="Origem"
          pinColor="green"
        />

        {/* Destino */}
        <Marker
          coordinate={{ latitude: viagem.destino_lat, longitude: viagem.destino_long }}
          title="Destino"
          pinColor="red"
        />

        {/* Localização do motorista */}
        {motoristaLocalizacao && (
          <Marker coordinate={motoristaLocalizacao} title="Motorista" pinColor="blue" />
        )}

        {/* Rota */}
        <MapViewDirections
          key={
            motoristaLocalizacao
              ? `${motoristaLocalizacao.latitude}-${motoristaLocalizacao.longitude}`
              : "initial"
          }
          origin={
            motoristaLocalizacao
              ? motoristaLocalizacao
              : { latitude: viagem.origem_lat, longitude: viagem.origem_long }
          }
          destination={{ latitude: viagem.destino_lat, longitude: viagem.destino_long }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="black"
        />
      </MapView>

      {!viagemIniciada ? (
        <TouchableOpacity
          onPress={iniciarViagem}
          disabled={loadingStatus}
          className={`absolute bottom-10 left-5 right-5 p-4 rounded-lg ${loadingStatus ? 'bg-gray-400' : 'bg-black'}`}
        >
          <Text className="text-white text-center font-bold">
            {loadingStatus ? "Iniciando..." : "Iniciar Viagem"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={finalizarViagem}
          disabled={loadingStatus}
          className={`absolute bottom-10 left-5 right-5 p-4 rounded-lg ${loadingStatus ? 'bg-gray-400' : 'bg-red-600'}`}
        >
          <Text className="text-white text-center font-bold">
            {loadingStatus ? "Finalizando..." : "Finalizar Viagem"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
