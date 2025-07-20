import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getTravel } from "../services/travelService";
import { useRoute } from "@react-navigation/native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { ActivityIndicator } from "react-native";


type Props ={};

export default function DetailsTravel({} : Props){
   const { userData } = useAuth();
   const route = useRoute();
   const travelId = route.params as {travelId: number};// Assuming you pass the travel ID through route params

   const [travelDetails, setTravelDetails] = useState<any>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   


   const fetchDetails = useCallback(async () => {
      if (!userData?.data?.id) {
         setError("Usuário não autenticado.");
         setLoading(false);
         return;
      }
      setLoading(true);
      setError(null);
      try {
         const data = await getTravel(travelId.travelId);
         setTravelDetails(data);
      } catch ( error ) {
         setError("Erro ao carregar detalhes da viagem.");
      } finally {
         setLoading(false);
      }
   }, [travelId, userData?.data?.id]);

   useEffect(() => {
      fetchDetails();
   }, [fetchDetails]);

   return (
      <View className="flex-1 p-4 bg-white">
         {loading ? (
            <View className="flex-1 justify-center items-center">
               <ActivityIndicator size="large" color="#0066cc" />
               <Text className="mt-2 text-gray-600">Carregando informações...</Text>
            </View>
         ): error ? (
            <View className="flex-1 justify-center items-center">
               <Text className="text-red-500">{error}</Text>
            </View>
         ) : travelDetails ?(
            <ScrollView className="flex-1 p-4">
            <Text className="text-2xl font-bold mb-6 text-center">Detalhes da Viagem</Text>
            
            <View className="bg-gray-50 p-4 rounded-lg mb-4">
               <Text className="text-lg font-semibold mb-2">Informações Gerais</Text>
               <Text className="mb-1"><Text className="font-medium">ID:</Text> {travelDetails.id || 'N/A'}</Text>
               <Text className="mb-1"><Text className="font-medium">Origem:</Text> {travelDetails.origin || 'N/A'}</Text>
               <Text className="mb-1"><Text className="font-medium">Destino:</Text> {travelDetails.destination || 'N/A'}</Text>
               <Text className="mb-1"><Text className="font-medium">Data:</Text> {travelDetails.date || 'N/A'}</Text>
               <Text className="mb-1"><Text className="font-medium">Horário:</Text> {travelDetails.time || 'N/A'}</Text>
               <Text className="mb-1"><Text className="font-medium">Preço:</Text> R$ {travelDetails.price || '0,00'}</Text>
               <Text className="mb-1"><Text className="font-medium">Vagas Disponíveis:</Text> {travelDetails.availableSeats || 'N/A'}</Text>
            </View>

            {travelDetails.driver && (
               <View className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Text className="text-lg font-semibold mb-2">Motorista</Text>
                  <Text className="mb-1"><Text className="font-medium">Nome:</Text> {travelDetails.driver.name || 'N/A'}</Text>
                  <Text className="mb-1"><Text className="font-medium">Email:</Text> {travelDetails.driver.email || 'N/A'}</Text>
                  <Text className="mb-1"><Text className="font-medium">Telefone:</Text> {travelDetails.driver.phone || 'N/A'}</Text>
               </View>
            )}

            {travelDetails.description && (
               <View className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Text className="text-lg font-semibold mb-2">Descrição</Text>
                  <Text>{travelDetails.description}</Text>
               </View>
            )}

            {travelDetails.passengers && travelDetails.passengers.length > 0 && (
               <View className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Text className="text-lg font-semibold mb-2">Passageiros</Text>
                  {travelDetails.passengers.map((passenger: any, index: number) => (
                     <Text key={index} className="mb-1">• {passenger.name || `Passageiro ${index + 1}`}</Text>
                  ))}
               </View>
            )}

            {/* Debug section - remove this in production */}
            <View className="bg-yellow-50 p-4 rounded-lg mt-4 border border-yellow-200">
               <Text className="text-sm font-medium text-yellow-800 mb-2">Debug - Dados Completos:</Text>
               <Text className="text-xs text-yellow-700">{JSON.stringify(travelDetails, null, 2)}</Text>
            </View>
         </ScrollView>
      ) : (
         <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-500 text-center">Nenhum detalhe encontrado para esta viagem.</Text>
         </View>
      )}
      </View>
   )
}