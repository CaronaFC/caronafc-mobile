import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getTravels } from "../services/travelService";

type Props = {};

export default function MyTravelsScreen({}: Props) {
  const { userData } = useAuth();
  const [travels, setTravels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2">Carregando suas viagens...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-red-500 mb-4 text-center">{error}</Text>
        <TouchableOpacity
          onPress={fetchTravels}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white font-semibold">Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-lg font-semibold mb-4">Minhas Viagens</Text>
      {travels.length === 0 ? (
        <Text>Você ainda não possui viagens cadastradas.</Text>
      ) : (
        <FlatList
          data={travels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="border-b border-gray-300 py-3">
              <Text className="font-semibold">
                Jogo: {item.jogo}
              </Text>
              <Text>Data: -</Text>
              <Text>
                Horário: {item.horario}
              </Text>
              <Text>Vagas: {item.qtdVagas}</Text>
              <Text>Valor por pessoa: R$ {item.valorPorPessoa}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
