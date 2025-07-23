import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { FontAwesome5 } from "@expo/vector-icons";

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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-50">
       <View className="mb-5">
        <TouchableOpacity
          onPress={fetchRequests}
          className="flex-row items-center bg-black px-5 py-3 rounded-md shadow"
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sync" size={18} color="#fff" />
          <Text className="text-white ml-3 font-semibold text-lg">Atualizar</Text>
        </TouchableOpacity>
      </View>
      {solicitacoes.length === 0 ? (
        <Text className="text-center text-gray-500 text-lg mt-10">
          Você ainda não possui solicitações.
        </Text>
      ) : (
        <FlatList
          data={solicitacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={RequestItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
