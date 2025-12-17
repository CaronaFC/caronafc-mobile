import React, { useCallback, useState } from "react";
import { Alert, FlatList, Text, View, Image, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { getTravelById } from "../../services/travelService";
import { fetchSolicitationsByTripId } from "../../services/requestsService";

import { TravelAPIResponseType } from "../../types/travel";
import { Request } from "../../types/request";
import { reverseGeocodeCoords } from "../../lib/location";
import { useAuth } from "../../context/AuthContext";
import CardPassenger from "../travel/CardPassenger";

type Props = {};

const TravelDetailScreen = (props: Props) => {
  const route = useRoute();
  const { id } = route.params as { id: number };
  const { userData } = useAuth();
  const [travel, setTravel] = useState<TravelAPIResponseType>();
  const [travelOrigin, setTravelOrigin] = useState("");
  const [travelApplicants, setTravelApplicants] = useState<Request[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchTravel = async () => {
        try {
          const travel = await getTravelById(id);
          if (!travel) {
            Alert.alert("Viagem não encontrada");
            return;
          }
          setTravel(travel);
          const originAddress = await reverseGeocodeCoords({
            latitude: travel.origem_lat,
            longitude: travel.origem_long,
          });
          setTravelOrigin(originAddress);
        } catch (error) {
          Alert.alert("Erro ao buscar viagem");
        }
      };

      const fetchApplicants = async () => {
        try {
          const applicants = await fetchSolicitationsByTripId(id);
          setTravelApplicants(applicants);
        } catch (error) {
          Alert.alert("Erro ao buscar solicitantes");
        }
      };

      fetchTravel();
      fetchApplicants();
    }, [id])
  );

  const filledPercentage = ((travel?.passageiros?.length ?? 0) / (travel?.qtdVagas || 1)) * 100;

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Match Header */}
        <View style={styles.matchHeader}>
          <Text style={styles.matchTitle}>
            {travel?.jogo?.timeCasa?.nome} vs {travel?.jogo?.timeFora?.nome}
          </Text>
          <Text style={styles.matchSubtitle}>
            {travel?.jogo?.data} às {travel?.jogo?.horario}
          </Text>
        </View>

        {/* Route Card */}
        <View style={styles.card}>
          <View style={styles.routeContainer}>
            <View style={styles.routeRow}>
              <Text style={styles.routeTime}>
                {travel?.horario
                  ? new Date(travel.horario).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </Text>
              <View style={styles.routeIconContainer}>
                <MaterialIcons name="location-on" size={20} color="#00FF87" />
              </View>
              <Text style={styles.routeText} numberOfLines={2}>{travelOrigin}</Text>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routeRow}>
              <Text style={styles.routeTime}>
                {travel?.jogo?.horario || "--:--"}
              </Text>
              <View style={styles.routeIconContainer}>
                <MaterialIcons name="stadium" size={20} color="#00FF87" />
              </View>
              <Text style={styles.routeText} numberOfLines={2}>
                {travel?.jogo?.estadio?.nome || "Estádio indefinido"}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalhes da Viagem</Text>

          <View style={styles.detailRow}>
            <MaterialIcons name="schedule" size={18} color="#00D170" />
            <Text style={styles.detailText}>
              Saída:{" "}
              {travel &&
                new Date(travel?.horario).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome5
              name={travel?.temRetorno ? "exchange-alt" : "long-arrow-alt-right"}
              size={16}
              color={travel?.temRetorno ? "#00FF87" : "#666666"}
            />
            <Text style={[styles.detailText, travel?.temRetorno && styles.accentText]}>
              {travel?.temRetorno ? "Com retorno incluído" : "Somente ida"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="directions-car" size={18} color="#00D170" />
            <Text style={styles.detailText}>
              {travel?.veiculo?.marca} - {travel?.veiculo?.modelo} ({travel?.veiculo?.cor})
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="attach-money" size={18} color="#00D170" />
            <Text style={styles.priceText}>
              R$ {travel?.valorPorPessoa} /pessoa
            </Text>
          </View>
        </View>

        {/* Capacity Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vagas</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${filledPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {travel?.passageiros?.length || 0}/{travel?.qtdVagas || 1} ocupadas
            </Text>
          </View>
        </View>

        {/* Driver Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Motorista</Text>
          <View style={styles.driverContainer}>
            {travel?.motorista?.imagem ? (
              <Image
                source={{ uri: travel.motorista.imagem }}
                style={styles.driverAvatar}
              />
            ) : (
              <View style={styles.driverAvatarPlaceholder}>
                <FontAwesome5 name="user-alt" size={20} color="#00FF87" />
              </View>
            )}
            <Text style={styles.driverName}>
              {travel?.motorista?.nome_completo}
            </Text>
          </View>
        </View>

        {/* Passengers Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Passageiros Confirmados</Text>
          {travelApplicants.filter((item) => item.status === "aceita").length === 0 ? (
            <Text style={styles.emptyText}>Nenhum passageiro confirmado ainda</Text>
          ) : (
            travelApplicants
              .filter((item) => item.status === "aceita")
              .map((item) => (
                <CardPassenger
                  key={item.id}
                  status={item.status}
                  estrelas={3}
                  img={item.usuario.imagem}
                  nome={item.usuario.nome_completo}
                  usuarioDesde={item.usuario.data_criacao}
                />
              ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 32,
  },
  matchHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  matchSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  routeContainer: {
    gap: 8,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTime: {
    width: 50,
    fontSize: 14,
    fontWeight: '600',
    color: '#00FF87',
    textAlign: 'center',
  },
  routeIconContainer: {
    width: 32,
    alignItems: 'center',
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    color: '#AAAAAA',
    marginLeft: 8,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#2A2A2A',
    marginLeft: 65,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#AAAAAA',
    flex: 1,
  },
  accentText: {
    color: '#00FF87',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00FF87',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FF87',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'right',
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#262626',
    padding: 12,
    borderRadius: 12,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00FF87',
  },
  driverAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00FF87',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export default TravelDetailScreen;
