import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import DefaultButton from "../commom/DefaultButton";
import Flamengo from "../../../assets/images/teams/flamengo.png";
import Palmeiras from "../../../assets/images/teams/palmeiras.png";
import { reverseGeocodeCoords } from "../../lib/location";
import { CardTravelProps } from "../../types/travel";
import { navigate } from "../../navigation/navigationService";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TravelDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TravelDetail"
>;

const CardTravel = ({
  id,
  handleRequest,
  horario,
  valorPorPessoa,
  veiculo,
  origemLat,
  origemLong,
  temRetorno,
  qtdVagas,
  motorista,
  jogo,
}: CardTravelProps) => {
  const renderIcon = () => (
    <MaterialCommunityIcons name="stadium-variant" size={24} color="black" />
  );
  const [origemName, setOrigemName] = useState("");
  const navigation = useNavigation<TravelDetailNavigationProp>();

  useEffect(() => {
    const getOrigemName = async () => {
      const origemName = await reverseGeocodeCoords({
        latitude: origemLat,
        longitude: origemLong,
      });

      setOrigemName(origemName);
    };

    getOrigemName();
  }, []);

  return (
    <View className="bg-secondaryWhite border-2 border-[#BBF7D0] rounded-md">
      <View className="flex-row justify-between bg-[#F0FDF4] p-3">
        <View className="w-full">
          <View className="flex-row items-center">
            <Text className="text-lg mb-2 flex-1 font-bold">
              {renderIcon()} {jogo.estadio?.nome || "Estádio Indefinido"}
            </Text>
            <Text className="text-lg text-black font-bold">
              {Number(valorPorPessoa).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
          <Text className="text-base font-semibold">
            {jogo.liga?.nome || "Indefinido"}
          </Text>
          <Text className="text-base font-semibold">
            {jogo.timeCasa?.nome || "Indefinido"} vs{" "}
            {jogo.timeFora?.nome || "Indefinido"}
          </Text>
          {origemName && (
            <Text className="text-base">Origem: {origemName}</Text>
          )}
        </View>
      </View>
      <View className=" gap-2 relative bg-[#F8F8F8] p-3 ">
        <Text>Data do jogo: {jogo.data || "Data indefinida"}</Text>
        <Text>
          Data de saída:{" "}
          {new Date(horario).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text>Motorista: {motorista.nome}</Text>
        <Text>Veiculo: {veiculo.modelo}</Text>
        <Text>Vagas: {qtdVagas}</Text>
        <Text>{temRetorno ? "Viagem com retorno" : "Viagem sem retorno."}</Text>

        <DefaultButton
          btnText="Ver Detalhes"
          btnColor="light"
          onPress={() => navigation.navigate("TravelDetail", { id })}
        />
        <DefaultButton
          onPress={() => handleRequest(id)}
          btnText="Pedir Carona"
          btnColor="dark"
        />

        {/* <View className="flex-row gap-2 absolute top-[-14] right-4">
          {times.map((time, index) => (
            <Image
              key={index}
              source={time.escudo}
              style={{ width: 42, height: 42 }}
            />
          ))}
        </View> */}
      </View>
    </View>
  );
};

export default CardTravel;

const styles = StyleSheet.create({});
