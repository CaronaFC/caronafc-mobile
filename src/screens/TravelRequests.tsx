import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
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
      console.error("Erro ao atualizar status:", err);
    }
  };

  const fetchTravelRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSolicitationsByTripId(id);
      setSolicitations(res);
    } catch (e) {
      console.error(e);
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
          className="w-12 h-12 rounded-full border border-gray-300"
        />
      );
    }
    return (
      <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
        <FontAwesome5 name="user-alt" size={18} color="#888" />
      </View>
    );
  };

  const renderItem = ({ item }: { item: Request }) => (
    <View className="border border-gray-200 rounded-xl p-4 mb-4 bg-white shadow-sm">
      <View className="flex-row items-center gap-3 mb-2">
        {renderUserAvatar(item.usuario?.imagem)}
        <View className="flex-1">
          <Text
            className="text-gray-800 font-semibold text-lg"
            numberOfLines={1}
          >
            {item.usuario?.nome_completo ?? "Nome não informado"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="envelope" size={14} color="#2563EB" />
        <Text className="text-gray-700">
          {item.usuario?.email ?? "Sem e-mail"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="phone" size={14} color="#22C55E" />
        <Text className="text-gray-700">
          {item.usuario?.numero ?? "Sem número"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="clock" size={14} color="#6366F1" />
        <Text className="text-gray-700">
          Solicitado em:{" "}
          {new Date(item.dataSolicitacao).toLocaleString("pt-BR")}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mt-2">
        <FontAwesome5 name="info-circle" size={14} color="#F59E0B" />
        <Text className="text-gray-700 font-medium">
          Status: {item.status}
        </Text>
      </View>

      {item.status === "pendente" && (
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="flex-1 mr-2 bg-green-600 rounded-md py-2"
            onPress={() => handleUpdateStatus(item.id, "aceita")}
          >
            <Text className="text-center text-white font-semibold">
              Aceitar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-2 bg-red-600 rounded-md py-2"
            onPress={() => handleUpdateStatus(item.id, "recusada")}
          >
            <Text className="text-center text-white font-semibold">
              Recusar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <View className="mb-5">
        <Text className="text-2xl font-bold text-gray-800 mb-1">{travel}</Text>
        <Text className="text-lg text-gray-600">
          Solicitações desta viagem:
        </Text>
      </View>

      {loading && (
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text className="mt-2 text-blue-700 font-semibold">
            Carregando solicitações...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View className="justify-center items-center">
          <Text className="text-red-600 font-semibold mb-4">{error}</Text>
        </View>
      )}

      {!loading && !error && solicitations.length === 0 && (
        <Text className="italic text-gray-500 mt-5 text-center">
          Nenhuma solicitação encontrada.
        </Text>
      )}

      <FlatList
        data={solicitations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
