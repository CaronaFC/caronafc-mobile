import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../navigation";

import { fetchSolicitationPassenger } from "../services/requestsService";
import { RequestType } from "../types/request";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MyTravelRequests"
>;

export default function MyTravelRequestsScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [solicitacoes, setSolicitacoes] = useState<RequestType[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await fetchSolicitationPassenger();
      setSolicitacoes(res);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      Alert.alert("Erro", "Não foi possível carregar as solicitações.");
    }
  };

  const handleNavigateToPayment = (item: RequestType) => {
    const travelId = item.viagem?.id;

    if (!travelId) {
      Alert.alert("Erro", "ID da viagem não encontrado");
      return;
    }

    console.log('Navegando para pagamento:', {
      travelId: travelId,
      solicitationId: item.id,
    });

    navigation.navigate("PaymentScreen", {
      travelId: travelId,
      solicitationId: item.id,
    });
  };

  const renderRequestItem = ({ item }: { item: RequestType }) => (
    <View className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
      {/* Informações da solicitação */}
      <Text className="text-gray-800 font-semibold text-lg mb-2">
        Viagem: {item.viagem?.jogo?.estadio?.nome || "Destino não informado"}
      </Text>

      <View className="flex-row items-center mb-2">
        <FontAwesome5 name="map-marker-alt" size={14} color="#22C55E" />
        <Text className="text-gray-600 ml-2">
          Cidade: {item.viagem?.jogo?.estadio?.cidade || "Cidade não informada"}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <FontAwesome5 name="calendar" size={14} color="#6366F1" />
        <Text className="text-gray-600 ml-2">
          Data: {item.viagem?.jogo?.data ? new Date(item.viagem.jogo.data).toLocaleDateString('pt-BR') : "Data não informada"}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <FontAwesome5 name="clock" size={14} color="#F59E0B" />
        <Text className="text-gray-600 ml-2">
          Horário: {item.viagem?.horario || "Horário não informado"}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <FontAwesome5 name="dollar-sign" size={14} color="#10B981" />
        <Text className="text-gray-600 ml-2">
          Valor: R$ {item.viagem?.valorPorPessoa || "0,00"}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <FontAwesome5 name="info-circle" size={14} color="#8B5CF6" />
        <Text className="text-gray-600 ml-2 font-medium">
          Status: <Text className={`${item.status === 'aceita' ? 'text-green-600' :
              item.status === 'recusada' ? 'text-red-600' :
                'text-yellow-600'
            } font-semibold`}>
            {item.status}
          </Text>
        </Text>
      </View>

      <View className="flex-row items-center mb-3">
        <FontAwesome5 name="calendar-plus" size={14} color="#6B7280" />
        <Text className="text-gray-600 ml-2">
          Solicitado em: {new Date(item.dataSolicitacao).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      {/* Status visual para diferentes estados */}
      {item.status === "pendente" && (
        <View className="mt-2 bg-yellow-100 border border-yellow-300 rounded-md py-2">
          <FontAwesome5 name="hourglass-half" size={16} color="yellow" />
          <Text className="text-center text-yellow-800 font-semibold">
            Aguardando Aprovação
          </Text>
        </View>
      )}

      {item.status === "recusada" && (
        <View className="mt-2 bg-red-100 border border-red-300 rounded-md py-2">
          <FontAwesome5 name="times-circle" size={16} color="red" />
          <Text className="text-center text-red-800 font-semibold">
            Solicitação Recusada
          </Text>
        </View>
      )}

      {/* Botão de pagamento APENAS para solicitações aceitas */}
      {item.status === "aceita" && (
        <TouchableOpacity
          className="mt-4 bg-green-600 rounded-md py-3 flex-row justify-center items-center shadow-md"
          onPress={() => handleNavigateToPayment(item)}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="credit-card" size={16} color="white" style={{ marginRight: 8 }} />
          <Text className="text-center text-white font-semibold text-base">
            💳 Prosseguir para Pagamento
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
        <View className="flex-1 justify-center items-center">
          <FontAwesome5 name="inbox" size={64} color="#9CA3AF" />
          <Text className="text-center text-gray-500 text-lg mt-4">
            Você ainda não possui solicitações.
          </Text>
          <Text className="text-center text-gray-400 text-sm mt-2">
            Quando solicitar uma carona, ela aparecerá aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={solicitacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRequestItem} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
