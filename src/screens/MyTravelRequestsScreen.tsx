import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
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

  const fetchRequests = async () => {
    try {
      const res = await fetchSolicitationPassenger();
      setSolicitacoes(res);
    } catch (error) {
      // Silent fail - empty list will be shown
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Minhas Solicitações</Text>

        <TouchableOpacity
          onPress={fetchRequests}
          style={styles.refreshButton}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sync" size={16} color="#0D0D0D" />
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </TouchableOpacity>

        {solicitacoes.length === 0 ? (
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
            data={solicitacoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={RequestItem}
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
    paddingHorizontal: 20,
    paddingTop: 60,
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
