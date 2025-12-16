import React, { useCallback, useState } from "react";
import { Alert, FlatList, Text, View, Image } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

import { getTravelById } from "../../services/travelService";
import { fetchSolicitationsByTripId } from "../../services/requestsService";

import { TravelAPIResponseType } from "../../types/travel";
import { Request } from "../../types/request";
import { reverseGeocodeCoords } from "../../lib/location";
import { useAuth } from "../../context/AuthContext";
import CardPassenger from "../travel/CardPassenger";

type Props = {};

const TravelDetailScreen = (props: Props) => {
  const rouse = useRoute();
  const { id } = rouse.params as { id: number };
  const { userData } = useAuth();
  const [travel, setTravel] = useState<TravelAPIResponseType>();
  const [travelOrigin, setTravelOrigin] = useState("");
  const [travelApplicants, setTravelApplicants] = useState<Request[]>([]);
  useFocusEffect(
    useCallback(() => {
      const fetchTravel = async () => {
        try {
          const travel = await getTravelById(id);
          if (!travel) {
            Alert.alert("Viagem não encontrada");
            return;
          }
          setTravel(travel);
          const originAddress = await reverseGeocodeCoords({
            latitude: travel.origem_lat,
            longitude: travel.origem_long,
          });
          setTravelOrigin(originAddress);
        } catch (error) {
          Alert.alert("Erro ao buscar viagem");
        }
      };

      const fetchApplicants = async () => {
        try {
          const applicants = await fetchSolicitationsByTripId(id);
          setTravelApplicants(applicants);
        } catch (error) {
          Alert.alert("Erro ao Solicitantes");
        }
      };

      fetchTravel();
      fetchApplicants();
    }, [id])
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-center">
          {travel?.jogo?.timeCasa?.nome} vs {travel?.jogo?.timeFora?.nome}
        </Text>
        <Text className="text-center text-gray-900 mt-1">
          {travel?.jogo?.data} às {travel?.jogo?.horario}
        </Text>
      </View>

      <View className="flex-row relative mb-4">
        <View className="flex-1 gap-5">
          <View className="flex-row items-center">
            <Text className="font-bold w-16 text-center">
              {travel?.horario
                ? new Date(travel.horario).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--"}
            </Text>
            <MaterialIcons name="location-on" size={24} color="#374151" />
            <Text className="ml-2 text-gray-700 flex-1">{travelOrigin}</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="font-bold w-16 text-center">
              {travel?.jogo?.horario || "--:--"}
            </Text>
            <MaterialIcons name="stadium" size={24} color="#374151" />
            <Text className="ml-2 text-gray-700 flex-1">
              {travel?.jogo?.estadio?.nome || "Estádio indefinido"}
            </Text>
          </View>
          <View className="absolute left-12 top-4 items-center mx-7">
            <View className="w-0.5 h-10 bg-[#374151] my-1" />
          </View>
        </View>
      </View>

      <View className="flex-col gap-2">
        <View className="flex-row items-center">
          <MaterialIcons name="schedule" size={20} color="#6B7280" />
          <Text className="ml-2">
            Saída:{" "}
            {travel &&
              new Date(travel?.horario).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
          </Text>
        </View>

        <View className="flex-row items-center">
          <AntDesign name="back" size={20} color="#6B7280" />
          <Text className="ml-2">
            {travel?.temRetorno ? "Viagem com retorno" : "Viagem sem retorno."}
          </Text>
        </View>

        <View className="flex-row items-center">
          <MaterialIcons name="directions-car" size={20} color="#6B7280" />
          <Text className="ml-2">
            {travel?.veiculo?.marca} - {travel?.veiculo?.modelo} (
            {travel?.veiculo?.cor})
          </Text>
        </View>

        <View className="flex-row items-center">
          <MaterialIcons name="attach-money" size={20} color="#6B7280" />
          <Text className="ml-2">
            Valor por pessoa: R$ {travel?.valorPorPessoa}
          </Text>
        </View>
      </View>

      <View className="px-2 mt-4">
        <Text className="text-sm text-gray-600">Vagas preenchidas</Text>
        <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
          <View
            className="bg-green-500 h-full"
            style={{
              width: `${
                ((travel?.passageiros?.length ?? 0) / (travel?.qtdVagas || 1)) *
                100
              }%`,
            }}
          />
        </View>
        <Text className="text-xs text-right text-gray-500 mb-2">
          {travel?.passageiros?.length || 0}/{travel?.qtdVagas || 1}
        </Text>
      </View>

      <Text className="text-base font-bold my-2">Motorista:</Text>
      <View className="flex-row items-center bg-gray-600 p-4 rounded-md gap-4">
        {travel?.motorista?.imagem ? (
          <Image
            source={{ uri: travel.motorista.imagem }}
            className="w-12 h-12 rounded-full border border-gray-300"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
            <MaterialIcons name="person" size={24} color="#888" />
          </View>
        )}
        <Text className="text-white font-semibold">
          {travel?.motorista?.nome_completo}
        </Text>
      </View>

      <Text className="text-base font-bold my-2">Passageiros:</Text>
      <View>
        <FlatList
          data={travelApplicants.filter((item) => item.status === "aceita")}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <CardPassenger
              status={item.status}
              estrelas={3}
              img={item.usuario.imagem}
              nome={item.usuario.nome_completo}
              usuarioDesde={item.usuario.data_criacao}
            />
          )}
        />
      </View>
    </View>
  );
};

export default TravelDetailScreen;
