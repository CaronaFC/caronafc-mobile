import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useCallback } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";

import { FontAwesome5 } from "@expo/vector-icons";
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
    const usuarioId=Number(userData?.data.id);

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
    if (userData?.data.id){
    fetchHistory();}
  }, [userData,fetchHistory]);

  const renderItem = ({ item }: { item: TravelAPIResponseType }) => (
    <TouchableOpacity
      className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm"
      onPress={() =>
        navigation.navigate("TravelDetail", { id: item.id })
      }
    >
      <Text className="text-gray-800 font-semibold text-lg mb-2">
        {item.jogo?.timeCasa?.nome} x {item.jogo?.timeFora?.nome}
      </Text>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="calendar-alt" size={14} color="#2563EB" />
        <Text className="text-gray-700">
          {new Date(item.horario).toLocaleString("pt-BR")}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="map-marker-alt" size={14} color="#22C55E" />
        <Text className="text-gray-700">
          Origem: {item.origem_lat.toFixed(2)}, {item.origem_long.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mt-2">
        <FontAwesome5 name="info-circle" size={14} color="#F59E0B" />
        <Text className="text-gray-700 font-medium">
          Status: {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <View className="mb-5">
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          Histórico de caronas
        </Text>
        <Text className="text-lg text-gray-600">
          Suas caronas
        </Text>
      </View>

      {loading && (
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text className="mt-2 text-blue-700 font-semibold">
            Carregando histórico...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View className="justify-center items-center">
          <Text className="text-red-600 font-semibold mb-4">
            {error}
          </Text>
        </View>
      )}

      {!loading && !error && travels.length === 0 && (
        <Text className="italic text-gray-500 mt-5 text-center">
          Nenhuma viagem encontrada.
        </Text>
      )}

      <FlatList
        data={travels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
