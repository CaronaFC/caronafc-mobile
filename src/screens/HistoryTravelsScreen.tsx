import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useCallback } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";

import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { fetchTravelHistory } from "../services/travelService";
import { TravelAPIResponseType } from "../types/travel";
import { useAuth } from "../context/AuthContext"

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "History"
>;

export default function HistoryTravelsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [loading, setLoading] = useState<boolean>(true);
  const [travels, setTravels] = useState<TravelAPIResponseType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useAuth();

  const fetchHistory = useCallback(async () => {
    const usuarioId=Number(userData?.data?.id);

    setLoading(true);
    setError(null);
    try {
      const res = await fetchTravelHistory(usuarioId);
      setTravels(res);
    } catch (e) {
      console.error(e);
      setError("Erro ao carregar histórico de viagens.");
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.data?.id) {
    fetchHistory();}
  }, [userData,fetchHistory]);

  const renderItem = ({ item }: { item: TravelAPIResponseType }) => (
    <TouchableOpacity
      style={styles.travelCard}
      onPress={() =>
        navigation.navigate("TravelDetail", { id: item.id })
      }
    >
      <View style={styles.cardHeader}>
        <FontAwesome5 name="futbol" size={18} color="#00FF87" />
        <Text style={styles.matchTitle}>
          {item.jogo?.timeCasa?.nome} x {item.jogo?.timeFora?.nome}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <FontAwesome5 name="calendar-alt" size={14} color="#00FF87" />
        <Text style={styles.detailText}>
          {new Date(item.horario).toLocaleString("pt-BR")}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <FontAwesome5 name="map-marker-alt" size={14} color="#00FF87" />
        <Text style={styles.detailText}>
          Origem: {item.origem_lat.toFixed(2)}, {item.origem_long.toFixed(2)}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <FontAwesome5 name="info-circle" size={14} color="#00FF87" />
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Histórico de caronas
        </Text>
        <Text style={styles.subtitle}>
          Suas caronas
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00FF87" />
          <Text style={styles.loadingText}>
            Carregando histórico...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-circle" size={48} color="#FF4444" />
          <Text style={styles.errorText}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHistory}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && travels.length === 0 && (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="car" size={48} color="#2A2A2A" />
          <Text style={styles.emptyText}>
            Nenhuma viagem encontrada.
          </Text>
          <Text style={styles.emptySubtext}>
            Suas viagens anteriores aparecerão aqui.
          </Text>
        </View>
      )}

      {!loading && !error && travels.length > 0 && (
        <FlatList
          data={travels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  travelCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#00FF8720',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#00FF87',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#00FF87',
    fontWeight: '600',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: '#FF4444',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#00FF87',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#0D0D0D',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
