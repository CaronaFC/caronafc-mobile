import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getTravel } from "../services/travelService";
import { useRoute } from "@react-navigation/native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { ActivityIndicator } from "react-native";


type Props = {};
const DetailsTravel = (props: Props) => {
  const { userData,userToken } = useAuth();
  const route = useRoute();
  const { travelId } = route.params as { travelId: number };

  const [travelDetails, setTravelDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTravelDetails = useCallback(async () => {
    if(!userData?.data?.id){
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const travelData = await getTravel(travelId);
      setTravelDetails(travelData);
    } catch (error) {
      console.error("Error fetching travel details:", error);
    } finally {
      setLoading(false);
    }
  }, [travelId, userToken]);

  useEffect(() => {
    fetchTravelDetails();
  }, [fetchTravelDetails]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!travelDetails) {
    return <Text>No travel details found.</Text>;
  }

  return (
    <View className="flex-1 bg-primaryWhite p-4">
    <Text className="text-xl font-bold mb-4">Detalhes da Viagem</Text>
    {loading ? (
      <Text>Carregando detalhes da viagem...</Text>
    ) : error ? (
      <Text>{error}</Text>
    ) : (
      <View>
        <Text className="text-lg font-bold mb-2">{travelDetails.title}</Text>
        <Text className="text-base mb-2">{travelDetails.description}</Text>
        <FlatList
          data={travelDetails.participants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-2 border-b border-gray-200">
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  )};
    </View>
  );
};
