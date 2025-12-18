import { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { RequestItem } from "../components/requests/RequestItem";
import { fetchSolicitationPassenger } from "../services/requestsService";
import { Request } from "../types/request";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MyTravelRequests"
>;

export default function MyTravelRequestsScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [solicitacoes, setSolicitacoes] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const res = await fetchSolicitationPassenger();
      setSolicitacoes(res);
    } catch (error) {
      // Silent fail - empty list will be shown
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests])
  );

  const onRefresh = useCallback(() => {
    fetchRequests(true);
  }, [fetchRequests]);

  // Filter to show accepted rides with active status at the top
  const sortedSolicitacoes = [...solicitacoes].sort((a, b) => {
    // Rides in progress first
    if (a.status === "aceita" && a.viagem?.status === "andamento") return -1;
    if (b.status === "aceita" && b.viagem?.status === "andamento") return 1;
    // Then accepted rides waiting
    if (a.status === "aceita" && a.viagem?.status === "espera") return -1;
    if (b.status === "aceita" && b.viagem?.status === "espera") return 1;
    // Then pending
    if (a.status === "pendente") return -1;
    if (b.status === "pendente") return 1;
    return 0;
  });

  if (loading) {
    return (
      <LinearGradient
        colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00FF87" />
          <Text style={styles.loadingText}>Carregando solicitações...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Minhas Solicitações</Text>

        <TouchableOpacity
          onPress={() => fetchRequests()}
          style={styles.refreshButton}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sync" size={16} color="#0D0D0D" />
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </TouchableOpacity>

        {sortedSolicitacoes.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="inbox" size={48} color="#2A2A2A" />
            <Text style={styles.emptyText}>
              Você ainda não possui solicitações
            </Text>
            <Text style={styles.emptySubtext}>
              Peça uma carona para aparecer aqui
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedSolicitacoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RequestItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#00FF87"
                colors={["#00FF87"]}
              />
            }
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
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FF87',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  refreshButtonText: {
    color: '#0D0D0D',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
