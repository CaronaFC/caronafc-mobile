import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { socket } from "../services/socket";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

import { getTravelById, updateTravelStatus } from "../services/travelService";
import { TravelAPIResponseType } from "../types/travel";

import { RateRideModal } from "../components/commom/RateRideModal";
import { useAuth } from "../context/AuthContext";
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
  const mapRef = useRef<MapView>(null);
  const { userData } = useAuth();

  const [viagem, setViagem] = useState<TravelAPIResponseType | null>(null);
  const { location: motoristaLocalizacao, setLocation: setMotoristaLocalizacao } = useMotoristaLocation();

  const [viagemIniciada, setViagemIniciada] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Estados para o modal de avaliação
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [pessoasParaAvaliar, setPessoasParaAvaliar] = useState<Array<{
    id: number;
    nome: string;
    tipo: 'motorista' | 'passageiro';
  }>>([]);
  const [indexAvaliacaoAtual, setIndexAvaliacaoAtual] = useState(0);

  // Check if current user is the driver
  const isDriver = viagem?.motorista?.id === userData?.data?.id;

  // Inicializar lista de pessoas a avaliar quando a viagem for finalizada
  const initializeRatings = () => {
    if (!viagem) return;
    
    const pessoasAvaliar: Array<{
      id: number;
      nome: string;
      tipo: 'motorista' | 'passageiro';
    }> = [];

    // Se é motorista, pode avaliar passageiros
    if (isDriver && viagem.passageiros && viagem.passageiros.length > 0) {
      viagem.passageiros.forEach(passageiro => {
        pessoasAvaliar.push({
          id: passageiro.id,
          nome: passageiro.nome_completo || passageiro.nome,
          tipo: 'passageiro',
        });
      });
    } 
    // Se é passageiro, pode avaliar motorista
    else if (!isDriver && viagem.motorista) {
      pessoasAvaliar.push({
        id: viagem.motorista.id,
        nome: viagem.motorista.nome_completo,
        tipo: 'motorista',
      });
    }

    setPessoasParaAvaliar(pessoasAvaliar);
    setIndexAvaliacaoAtual(0);
  };

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Não foi possível acessar sua localização. Verifique as permissões do aplicativo."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert(
          "Erro de localização",
          "Não foi possível obter sua localização atual."
        );
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchViagem = async () => {
      try {
        const data = await getTravelById(id);
        if (isMounted) {
          setViagem(data);
          setViagemIniciada(data.status === "andamento");
        }
      } catch {
        Alert.alert("Erro ao buscar dados da viagem");
      }
    };

    fetchViagem();

    socket.connect();
    socket.emit("entrarViagem", id);

    socket.on("motorista:atualizacao", ({ latitude, longitude }) => {
      if (isMounted) {
        setMotoristaLocalizacao({ latitude, longitude });
      }
    });

    // Listen for ride start event (for passengers)
    socket.on("viagem:iniciada", () => {
      if (isMounted) {
        setViagemIniciada(true);
        Alert.alert(
          "Viagem Iniciada! 🚗",
          "O motorista iniciou a viagem. Você pode acompanhar o trajeto em tempo real."
        );
      }
    });

    // Listen for ride end event (for passengers)
    socket.on("viagem:finalizada", () => {
      if (isMounted) {
        setViagemIniciada(false);
        Alert.alert(
          "Viagem Finalizada! 🏁",
          "A viagem foi finalizada. Obrigado por usar o CaronaFC!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    });

    return () => {
      isMounted = false;
      socket.off("motorista:atualizacao");
      socket.off("viagem:iniciada");
      socket.off("viagem:finalizada");
      socket.disconnect();
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, [id, setMotoristaLocalizacao, navigation]);

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

      // Emit socket event to notify passengers
      socket.emit("viagem:iniciar", { viagemId: id });
    } catch {
      Alert.alert("Erro ao iniciar viagem.");
      return;
    } finally {
      setLoadingStatus(false);
    }

    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
      (localizacao: Location.LocationObject) => {
        const { latitude, longitude } = localizacao.coords;
        socket.emit("motorista:localizacao", { viagemId: id, latitude, longitude });
        setMotoristaLocalizacao({ latitude, longitude });
      }
    );
    locationSubscriptionRef.current = subscription;
  };

  const finalizarViagem = async () => {
    try {
      setLoadingStatus(true);
      await updateTravelStatus(id, "finalizada");
      setViagemIniciada(false);

      // Emit socket event to notify passengers
      socket.emit("viagem:finalizar", { viagemId: id });

      // Inicializar avaliações e mostrar modal
      initializeRatings();
      setTimeout(() => {
        setShowRatingModal(true);
      }, 500);
    } catch {
      Alert.alert("Erro ao finalizar viagem.");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Função para ir para a próxima avaliação ou fechar modal
  const handleAvaliacaoProxima = () => {
    if (indexAvaliacaoAtual < pessoasParaAvaliar.length - 1) {
      setIndexAvaliacaoAtual(indexAvaliacaoAtual + 1);
    } else {
      handleCloseRatingModal();
    }
  };

  // Função para fechar o modal de avaliação
  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setPessoasParaAvaliar([]);
    setIndexAvaliacaoAtual(0);
    navigation.goBack();
  };

  if (!viagem) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF87" />
        <Text style={styles.loadingText}>Carregando viagem...</Text>
      </View>
    );
  }

  const origemLat = Number(viagem.origem_lat);
  const origemLong = Number(viagem.origem_long);
  const destinoLat = Number(viagem.destino_lat);
  const destinoLong = Number(viagem.destino_long);

  const hasValidCoordinates =
    !isNaN(origemLat) && !isNaN(origemLong) &&
    !isNaN(destinoLat) && !isNaN(destinoLong) &&
    origemLat !== 0 && origemLong !== 0;

  if (!hasValidCoordinates) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome5 name="map-marked-alt" size={48} color="#666666" />
        <Text style={styles.errorText}>
          Coordenadas da viagem não disponíveis
        </Text>
      </View>
    );
  }

  const fitMapToMarkers = () => {
    if (mapRef.current) {
      const coordinates = [
        { latitude: origemLat, longitude: origemLong },
        { latitude: destinoLat, longitude: destinoLong },
      ];

      if (motoristaLocalizacao) {
        coordinates.push(motoristaLocalizacao);
      }

      if (userLocation) {
        coordinates.push(userLocation);
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || motoristaLocalizacao?.latitude || origemLat,
          longitude: userLocation?.longitude || motoristaLocalizacao?.longitude || origemLong,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onMapReady={fitMapToMarkers}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{ latitude: origemLat, longitude: origemLong }}
          title="Ponto de Partida"
          description="Local de saída"
        >
          <View style={styles.markerContainer}>
            <View style={[styles.marker, styles.markerOrigem]}>
              <FontAwesome5 name="flag-checkered" size={16} color="#FFFFFF" />
            </View>
          </View>
        </Marker>

        <Marker
          coordinate={{ latitude: destinoLat, longitude: destinoLong }}
          title="Destino"
          description={viagem.jogo?.estadio?.nome || "Estádio"}
        >
          <View style={styles.markerContainer}>
            <View style={[styles.marker, styles.markerDestino]}>
              <FontAwesome5 name="futbol" size={16} color="#FFFFFF" />
            </View>
          </View>
        </Marker>

        {userLocation && !motoristaLocalizacao && (
          <Marker
            coordinate={userLocation}
            title="Você está aqui"
            description="Sua localização atual"
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, styles.markerUser]}>
                <FontAwesome5 name="user" size={16} color="#FFFFFF" />
              </View>
            </View>
          </Marker>
        )}

        {motoristaLocalizacao && (
          <Marker
            coordinate={motoristaLocalizacao}
            title="Motorista"
            description="Localização atual"
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, styles.markerDriver]}>
                <FontAwesome5 name="car" size={16} color="#FFFFFF" />
              </View>
            </View>
          </Marker>
        )}

        {(userLocation || motoristaLocalizacao) && !viagemIniciada && (
          <MapViewDirections
            origin={motoristaLocalizacao || userLocation!}
            destination={{ latitude: origemLat, longitude: origemLong }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#3B82F6"
            lineDashPattern={[10, 5]}
            onReady={(result) => {
              setRouteInfo({
                distance: result.distance,
                duration: result.duration,
              });
            }}
          />
        )}

        <MapViewDirections
          origin={
            viagemIniciada && motoristaLocalizacao
              ? motoristaLocalizacao
              : { latitude: origemLat, longitude: origemLong }
          }
          destination={{ latitude: destinoLat, longitude: destinoLong }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="#00FF87"
          onReady={(result) => {
            if (viagemIniciada || !motoristaLocalizacao) {
              setRouteInfo({
                distance: result.distance,
                duration: result.duration,
              });
            }
            fitMapToMarkers();
          }}
        />
      </MapView>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <FontAwesome5 name="futbol" size={16} color="#00FF87" />
          <Text style={styles.infoTitle} numberOfLines={1}>
            {viagem.jogo?.timeCasa?.nome} x {viagem.jogo?.timeFora?.nome}
          </Text>
        </View>

        {routeInfo && (
          <View style={styles.routeInfoRow}>
            <View style={styles.routeInfoItem}>
              <FontAwesome5 name="road" size={14} color="#00FF87" />
              <Text style={styles.routeInfoText}>
                {routeInfo.distance.toFixed(1)} km
              </Text>
            </View>
            <View style={styles.routeInfoItem}>
              <FontAwesome5 name="clock" size={14} color="#00FF87" />
              <Text style={styles.routeInfoText}>
                {Math.round(routeInfo.duration)} min
              </Text>
            </View>
          </View>
        )}

        <View style={styles.statusRow}>
          <View style={[
            styles.statusBadge,
            viagemIniciada ? styles.statusActive : styles.statusWaiting
          ]}>
            <Text style={[styles.statusText, { color: viagemIniciada ? '#00FF87' : '#F59E0B' }]}>
              {viagemIniciada ? "Em andamento" : "Aguardando início"}
            </Text>
          </View>
          {!isDriver && (
            <View style={styles.roleBadge}>
              <FontAwesome5 name="user" size={10} color="#3B82F6" />
              <Text style={styles.roleText}>Passageiro</Text>
            </View>
          )}
        </View>
      </View>

      {/* Driver Controls */}
      {isDriver && (
        <>
          {!viagemIniciada ? (
            <TouchableOpacity
              onPress={iniciarViagem}
              disabled={loadingStatus}
              style={[styles.actionButton, styles.startButton, loadingStatus && styles.buttonDisabled]}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="play" size={18} color="#0D0D0D" />
              <Text style={styles.startButtonText}>
                {loadingStatus ? "Iniciando..." : "Iniciar Viagem"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={finalizarViagem}
              disabled={loadingStatus}
              style={[styles.actionButton, styles.endButton, loadingStatus && styles.buttonDisabled]}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="flag-checkered" size={18} color="#FFFFFF" />
              <Text style={styles.endButtonText}>
                {loadingStatus ? "Finalizando..." : "Finalizar Viagem"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Passenger Status Cards */}
      {!isDriver && !viagemIniciada && (
        <View style={styles.passengerWaitingCard}>
          <FontAwesome5 name="hourglass-half" size={20} color="#F59E0B" />
          <Text style={styles.passengerWaitingText}>
            Aguardando o motorista iniciar a viagem...
          </Text>
        </View>
      )}

      {!isDriver && viagemIniciada && (
        <View style={styles.passengerTrackingCard}>
          <FontAwesome5 name="satellite-dish" size={20} color="#00FF87" />
          <Text style={styles.passengerTrackingText}>
            Acompanhando viagem em tempo real
          </Text>
        </View>
      )}

      {/* Center Map Button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={fitMapToMarkers}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="crosshairs" size={20} color="#00FF87" />
      </TouchableOpacity>

      {/* Modal de Avaliação */}
      {pessoasParaAvaliar.length > 0 && (
        <RateRideModal
          visible={showRatingModal}
          avaliadoId={pessoasParaAvaliar[indexAvaliacaoAtual]?.id}
          viagemId={id}
          nome={pessoasParaAvaliar[indexAvaliacaoAtual]?.nome}
          tipo={pessoasParaAvaliar[indexAvaliacaoAtual]?.tipo}
          onClose={handleAvaliacaoProxima}
          onSuccess={handleAvaliacaoProxima}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  errorText: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerOrigem: {
    backgroundColor: '#3B82F6',
  },
  markerDestino: {
    backgroundColor: '#00FF87',
  },
  markerDriver: {
    backgroundColor: '#0D0D0D',
  },
  markerUser: {
    backgroundColor: '#8B5CF6',
  },
  infoCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  routeInfoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeInfoText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusWaiting: {
    backgroundColor: '#F59E0B20',
  },
  statusActive: {
    backgroundColor: '#00FF8720',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00FF87',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#3B82F620',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  actionButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  startButton: {
    backgroundColor: '#00FF87',
  },
  endButton: {
    backgroundColor: '#EF4444',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: '#0D0D0D',
    fontSize: 18,
    fontWeight: '700',
  },
  endButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  centerButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  passengerWaitingCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#F59E0B20',
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  passengerWaitingText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  passengerTrackingCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#00FF8720',
    borderWidth: 1,
    borderColor: '#00FF8740',
  },
  passengerTrackingText: {
    color: '#00FF87',
    fontSize: 14,
    fontWeight: '600',
  },
});
