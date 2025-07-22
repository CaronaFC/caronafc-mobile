import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { getTravelById } from "../../services/travelService";
import { TravelAPIResponseType } from "../../types/travel";
import { reverseGeocodeCoords } from "../../lib/location";
import DefaultButton from "./DefaultButton";
import CardPassenger from "../travel/CardPassenger";
import { fetchSolicitationsByTripId } from "../../services/requestsService";
import { RequestType } from "../../types/request";
import { useAuth } from "../../context/AuthContext";

type Props = {};

const TravelDetailScreen = (props: Props) => {
  const rouse = useRoute();
  const { id } = rouse.params as { id: number };
  const { userData } = useAuth();
  const [travel, setTravel] = useState<TravelAPIResponseType>();
  const [travelOrigin, setTravelOrigin] = useState("");
  const [travelApplicants, setTravelApplicants] = useState<RequestType[]>([]);
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
          console.log("Applicants>", applicants);
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
    <View className=" p-4 bg-white h-screen">
      <View className="flex-row relative">
        <View className="flex-1 gap-5">
          {/* Primeira parada */}
          <View className="flex-row items-start gap-x-12">
            <Text className="w-12 font-bold">
              {travel?.horario
                ? new Date(travel.horario).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--"}
            </Text>

            <View>
              <Text className="font-bold text-md">{travelOrigin}</Text>
            </View>
          </View>

          {/* Segunda parada */}
          <View className="flex-row items-start gap-x-12">
            <Text className="w-12 font-bold">{travel?.jogo.horario}</Text>

            <View>
              <Text className="font-bold">{travel?.jogo.estadio.nome}</Text>
            </View>
          </View>

          <View className="items-center mx-2 absolute left-14">
            <View className="w-2 h-2 rounded-full border-2 bg-white  border-black" />
            <View className="w-0.5 h-12 bg-black" />
            <View className="w-2 h-2 rounded-full border-2 border-black bg-white" />
          </View>
        </View>
      </View>
      <View className="items-center justify-between">
        {/* <View className="flex-row space-x-2">
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/1/16/CRF_logo.png",
            }}
            className="w-8 h-8"
            resizeMode="contain"
          />
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/pt/0/0e/Palmeiras_logo.png",
            }}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </View> */}

        <TouchableOpacity className="px-3 py-2 rounded my-10">
          <Text className="text-lg font-semibold">
            {travel?.jogo.timeCasa?.nome || "Indefinido"} vs{" "}
            {travel?.jogo.timeFora?.nome || "Indefinido"}
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <View>
          <Text>
            Vagas {travel?.passageiros?.length || 0}/{travel?.qtdVagas}
          </Text>
          <FlatList
            data={travelApplicants}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <CardPassenger
                status={item.status}
                estrelas={3}
                nome={item.usuario.nome_completo}
                usuarioDesde={item.usuario.data_criacao}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default TravelDetailScreen;
