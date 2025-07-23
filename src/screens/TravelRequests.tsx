import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

import { FontAwesome5 } from "@expo/vector-icons";
import { createPayment } from "../services/paymentService";
import {
  fetchSolicitationsByTripId,
  updateSolicitationStatus,
} from "../services/requestsService";
import { RequestType } from "../types/request";
import { TravelAPIResponseType } from "../types/travel";

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
  const [solicitations, setSolicitations] = useState<RequestType[]>([]);
  const [travels, setTravels] = useState<TravelAPIResponseType[]>([]);
  const [error, setError] = useState<string | null>(null);

const handlePaymentPix = async (item: RequestType) => {
    console.log("\n\n\nIniciando pagamento Pix para:", item);
    const travelId = item.viagem?.id;
    const amount = item.viagem?.valorPorPessoa;

    if (!travelId || !amount) {
      Alert.alert("Erro", "Dados da viagem incompletos");
      return;
    }

    const nomeParts = item.usuario.nome_completo.split(" ");
    const firstName = nomeParts[0];
    const lastName = nomeParts.slice(1).join(" ");

    const payload = {
      amount: amount,
      description: `Pagamento pela viagem ${travelId}`,
      payment_method_id: 'pix',
      payer: {
        email: item.usuario.email,
        first_name: firstName,
        last_name: lastName || '-',
        identification: {
          type: 'CPF',
          number: item.usuario.cpf,
        },
      },
      travelId: travelId,
      solicitationId: item.id,
    };

    console.log("Enviando payload para criação do pagamento:", payload);

    try {
      const response = await createPayment(payload);
      console.log("Pagamento Pix criado com sucesso:", response);
      // agora você pode exibir o QR CODE no app
    } catch (err) {
      console.error("Erro ao criar pagamento Pix:", err);
      Alert.alert("Erro ao pagar", "Tente novamente mais tarde");
    }
  };



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

  const renderItem = ({ item }: { item: any }) => (
    <View className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <Text className="text-gray-800 font-semibold text-lg mb-1">
        Solicitante: {item.usuario?.nome_completo ?? "Nome não informado"}
      </Text>

      <View className="flex-row items-center space-x-2 mb-1 gap-2">
        <FontAwesome5 name="envelope" size={14} color="#2563EB" />
        <Text className="text-gray-700">
          {item.usuario?.email ?? "Sem e-mail"}
        </Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1 gap-2">
        <FontAwesome5 name="phone" size={14} color="#22C55E" />
        <Text className="text-gray-700">
          {item.usuario?.numero ?? "Sem número"}
        </Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1 gap-2">
        <FontAwesome5 name="clock" size={14} color="#6366F1" />
        <Text className="text-gray-700">
          Solicitado em:{" "}
          {new Date(item.dataSolicitacao).toLocaleString("pt-BR")}
        </Text>
      </View>

      <View className="flex-row items-center space-x-2 mt-2 gap-2">
        <FontAwesome5 name="info-circle" size={14} color="#F59E0B" />
        <Text className="text-gray-700 font-medium">Status: {item.status}</Text>
      </View>

      {/* Botões de aceitar/recusar para status pendente */}
      {item.status === "pendente" && (
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="flex-1 mr-2 bg-green-600 rounded-md py-2"
            onPress={() => {
              handleUpdateStatus(item.id, "aceita")
              handlePaymentPix(item);
            }}
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
