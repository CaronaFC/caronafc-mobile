import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getTravels } from "../services/travelService";

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

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
        <Text className="text-red-600 mb-4 text-center font-semibold">{error}</Text>
        <TouchableOpacity
          onPress={fetchTravels}
          className="bg-blue-600 px-5 py-3 rounded-md shadow"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-lg">Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="futbol" size={16} color="#2563EB" />
        <Text className="text-gray-700 font-semibold ms-2">{item.jogo?.timeCasa?.nome ?? "Indefinido"} x {item.jogo?.timeFora?.nome ?? "Indefinido"}</Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="trophy" size={16} color="#EF4444" />
        <Text className="text-gray-700 font-semibold ms-2">Liga: {item.jogo?.liga?.nome ?? "Indefinida"}</Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="landmark" size={16} color="#10B981" />
        <Text className="text-gray-700 font-semibold ms-2">
          Estádio: {item.jogo?.estadio?.nome || "Não informado"}
        </Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="clock" size={16} color="#6366F1" />
        <Text className="text-gray-700 font-semibold ms-2">
          Data: {item.jogo?.data || "Indefinida"}
        </Text>
      </View>

      <View
        className="my-4 border-b border-gray-300"
      />

      <View className="flex-row items-center space-x-1">
        <FontAwesome5 name="clock" size={16} color="#6366F1" />
        <Text className="text-gray-800 ms-3 font-semibold">
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

      <View className="flex-row justify-between">
        <View className="flex-row items-center space-x-1">
          <FontAwesome5 name="users" size={16} color="#F59E0B" />
          <Text className="text-gray-700 font-semibold ms-2">Vagas: {item.qtdVagas}</Text>
        </View>

        <View className="flex-row items-center space-x-1">
          <FontAwesome5 name="money-bill-wave" size={16} color="#22C55E" />
          <Text className="text-gray-700 font-semibold ms-2">
            {item.valorPorPessoa ? `R$ ${Number(item.valorPorPessoa).toFixed(2)}` : "Grátis"} /pessoa
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("TravelRequests", { id: item.id })}
        className="mt-3 bg-blue-600 rounded-md px-4 py-2"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-center">Ver solicitações</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <View className="mb-5">
        <TouchableOpacity
          onPress={fetchTravels}
          className="flex-row items-center bg-black px-5 py-3 rounded-md shadow"
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sync" size={18} color="#fff" />
          <Text className="text-white ml-3 font-semibold text-lg">Atualizar</Text>
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
