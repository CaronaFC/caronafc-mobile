import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getTravels } from "../services/travelService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { TravelAPIResponseType } from "../types/travel";
import { PassengerType } from "../types/passanger";

type Props = {};

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MyTravelsScreen"
>;

export default function MyTravelsScreen({}: Props) {
  const { userData } = useAuth();
  const [travels, setTravels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const fetchTravels = useCallback(async () => {
    if (!userData?.data?.id) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getTravels({ motoristaId: userData.data.id });
      setTravels(data);
    } catch (err) {
      setError("Erro ao carregar viagens.");
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text className="mt-2 text-blue-700 font-semibold">
          Carregando suas viagens...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-white">
        <Text className="text-red-600 mb-4 text-center font-semibold">
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchTravels}
          className="bg-blue-600 px-5 py-3 rounded-md shadow"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-lg">
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderStatusColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      espera: "#F59E0B",
      andamento: "#2563EB",
      finalizada: "#10B981",
    }

    return statusColorMap[status] || "#9CA3AF";
  };

  const renderStatusName = (status: string) => {
    const statusNameMap: { [key: string]: string } = {
      espera: "Aguardando início",
      andamento: "Em andamento",
      finalizada: "Finalizada",
    };

    return statusNameMap[status] || "Indefinido";
  };

  const renderPassengerAvatar = (passageiro: PassengerType) => {
    if (passageiro.imagem) {
      return (
        <Image
          source={{ uri: passageiro.imagem }}
          className="w-8 h-8 rounded-full border border-gray-300"
        />
      );
    }
    return (
      <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
        <Ionicons name="person-circle-outline" size={20} color="#666" />
      </View>
    );
  };

  const renderItem = ({ item }: { item: TravelAPIResponseType }) => (
    <View className="border border-gray-200 rounded-xl p-4 mb-4 bg-white shadow-sm">
      <View className="flex-row items-center gap-2 mb-2">
        <FontAwesome5 name="futbol" size={16} color="#2563EB" />
        <Text
          className="text-gray-800 font-semibold text-base"
          numberOfLines={1}
        >
          {item.jogo?.timeCasa?.nome ?? "Indefinido"} x{" "}
          {item.jogo?.timeFora?.nome ?? "Indefinido"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="trophy" size={16} color="#EF4444" />
        <Text className="text-gray-700 font-medium">
          Liga: {item.jogo?.liga?.nome ?? "Indefinida"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="landmark" size={16} color="#10B981" />
        <Text className="text-gray-700 font-medium">
          Estádio: {item.jogo?.estadio?.nome || "Não informado"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="clock" size={16} color="#6366F1" />
        <Text className="text-gray-700 font-medium">
          Data: {item.jogo?.data || "Indefinida"}
        </Text>
      </View>

      <View className="my-3 border-b border-gray-200" />

      <View className="flex-row items-center gap-2 mb-2">
        <FontAwesome5 name="clock" size={16} color="#6366F1" />
        <Text className="text-gray-800 font-semibold">
          Saída:{" "}
          {new Date(item.horario).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <FontAwesome5 name="users" size={16} color="#F59E0B" />
          <Text className="text-gray-700 font-medium">
            Vagas: {item.qtdVagas}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <FontAwesome5 name="money-bill-wave" size={16} color="#22C55E" />
          <Text className="text-gray-700 font-medium">
            {item.valorPorPessoa
              ? `R$ ${Number(item.valorPorPessoa).toFixed(2)}`
              : "Grátis"}{" "}
            /pessoa
          </Text>
        </View>
      </View>

      <Text className="text-gray-800 font-semibold mb-1">Passageiros:</Text>
      {item.passageiros && item.passageiros.length > 0 ? (
        item.passageiros.map((passageiro: PassengerType) => (
          <View
            key={passageiro.id}
            className="flex-row items-center gap-3 mb-2"
          >
            {renderPassengerAvatar(passageiro)}
            <Text className="text-gray-800 font-medium">
              {passageiro.nome_completo}
            </Text>
          </View>
        ))
      ) : (
        <Text className="italic text-gray-500">Nenhum passageiro</Text>
      )}

      <View className="flex-row items-center gap-2 mt-3">
        <FontAwesome5 name="info-circle" size={16} color={renderStatusColor(item.status)} />
        <Text className="text-gray-700 font-medium">Status: {renderStatusName(item.status)}</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (item.status === "finished") {
            Alert.alert("Viagem finalizada", "Esta viagem já foi concluída.");
            return;
          }
          navigation.navigate("TravelProgress", { id: item.id });
        }}
        className="mt-4 bg-black rounded-md px-4 py-2"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-center">Acompanhar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("TravelRequests", {
            id: item.id,
            travel: item.jogo?.estadio?.nome,
          })
        }
        className="mt-3 bg-black rounded-md px-4 py-2"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-center">
          Ver solicitações
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <View className="mb-4">
        <TouchableOpacity
          onPress={fetchTravels}
          className="flex-row items-center bg-black px-5 py-3 rounded-md shadow"
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sync" size={18} color="#fff" />
          <Text className="text-white ml-3 font-semibold text-lg">
            Atualizar
          </Text>
        </TouchableOpacity>
      </View>

      {travels.length === 0 ? (
        <Text className="text-center text-gray-500 text-lg mt-10">
          Você ainda não possui viagens cadastradas.
        </Text>
      ) : (
        <FlatList
          data={travels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
