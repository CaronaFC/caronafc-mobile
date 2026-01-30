import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  fetchSolicitationsByTripId,
  updateSolicitationStatus,
} from "../services/requestsService";
import { FontAwesome5 } from "@expo/vector-icons";
import { Request } from "../types/request";
import { LinearGradient } from "expo-linear-gradient";

type TravelRequestsRouteProp = RouteProp<RootStackParamList, "TravelRequests">;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TravelRequests"
>;

export default function TravelRequestsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TravelRequestsRouteProp>();

  const { id, travel } = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [solicitations, setSolicitations] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateStatus = async (
    solicitacaoId: number,
    status: "aceita" | "recusada"
  ) => {
    try {
      await updateSolicitationStatus(solicitacaoId, status);
      fetchTravelRequests();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o status da solicitação.");
    }
  };

  const fetchTravelRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSolicitationsByTripId(id);
      setSolicitations(res);
    } catch (e) {
      setError("Erro ao carregar solicitações.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTravelRequests();
  }, [fetchTravelRequests]);

  const renderUserAvatar = (imagem: string | null | undefined) => {
    if (imagem) {
      return (
        <Image
          source={{ uri: imagem }}
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={styles.avatarPlaceholder}>
        <FontAwesome5 name="user-alt" size={18} color="#00FF87" />
      </View>
    );
  };

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { color: string; bgColor: string; label: string } } = {
      pendente: { color: "#F59E0B", bgColor: "#F59E0B20", label: "Pendente" },
      aceita: { color: "#00FF87", bgColor: "#00FF8720", label: "Aceita" },
      recusada: { color: "#EF4444", bgColor: "#EF444420", label: "Recusada" },
    };
    return configs[status] || { color: "#888888", bgColor: "#88888820", label: status };
  };

  const renderItem = ({ item }: { item: Request }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {renderUserAvatar(item.usuario?.imagem)}
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.usuario?.nome_completo ?? "Nome não informado"}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <FontAwesome5 name="envelope" size={14} color="#00D170" />
          <Text style={styles.infoText}>
            {item.usuario?.email ?? "Sem e-mail"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="phone" size={14} color="#00D170" />
          <Text style={styles.infoText}>
            {item.usuario?.numero ?? "Sem número"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="clock" size={14} color="#00D170" />
          <Text style={styles.infoText}>
            Solicitado em: {new Date(item.dataSolicitacao).toLocaleString("pt-BR")}
          </Text>
        </View>

        {item.status === "pendente" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleUpdateStatus(item.id, "aceita")}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="check" size={14} color="#0D0D0D" />
              <Text style={styles.acceptButtonText}>Aceitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleUpdateStatus(item.id, "recusada")}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="times" size={14} color="#EF4444" />
              <Text style={styles.rejectButtonText}>Recusar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{travel}</Text>
          <Text style={styles.subtitle}>Solicitações desta viagem</Text>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00FF87" />
            <Text style={styles.loadingText}>Carregando solicitações...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchTravelRequests}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && solicitations.length === 0 && (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="inbox" size={48} color="#333333" />
            <Text style={styles.emptyText}>Nenhuma solicitação encontrada</Text>
            <Text style={styles.emptySubtext}>
              Quando passageiros solicitarem carona, aparecerão aqui
            </Text>
          </View>
        )}

        {!loading && !error && solicitations.length > 0 && (
          <FlatList
            data={solicitations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00FF87',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#00FF87',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#0D0D0D',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
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
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00FF87',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00FF87',
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  infoText: {
    color: '#AAAAAA',
    fontSize: 14,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00FF87',
    paddingVertical: 12,
    borderRadius: 12,
  },
  acceptButtonText: {
    color: '#0D0D0D',
    fontWeight: '700',
    fontSize: 14,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  rejectButtonText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
});
