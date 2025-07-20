import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import DefaultButton from "../commom/DefaultButton";
import Flamengo from "../../../assets/images/teams/flamengo.png";
import Palmeiras from "../../../assets/images/teams/palmeiras.png";

type CardTravelProps = {
  id: number;
  horario: string;
  valorPorPessoa: string;
  origemLat: number;
  origemLong: number;
  temRetorno: boolean;
  qtdVagas: number;

  motorista: {
    nome: string;
    id: number;
  };

  jogo: {
    id: number;
    estadio: string;
    timeCasa: string;
    timeFora: string;
    campeonato?: string;
    dataJogo: string;
  };
};


const CardTravel = ({
  id,
  horario,
  valorPorPessoa,
  origemLat,
  origemLong, 
  temRetorno, 
  qtdVagas, 
  motorista,
  jogo
}: CardTravelProps) => {
  const renderIcon = () => <MaterialCommunityIcons name="stadium-variant" size={24} color="black" />;
  return (
    <View className="bg-secondaryWhite border-2 border-[#BBF7D0] rounded-md">
      <View className="flex-row justify-between bg-[#F0FDF4] p-3">
      <View>
          <Text className="text-lg mb-2">{renderIcon()} {jogo.estadio}</Text>
          <Text className="text-base">{jogo.timeCasa} vs {jogo.timeFora}</Text>
      </View>
        <Text className="text-lg text-black">R$ {valorPorPessoa}</Text>
      </View>
      <View className=" gap-2 relative bg-[#F8F8F8] p-3 ">
        <Text>Data: {jogo.dataJogo}</Text>
        <Text>Horário: {new Date(horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

        {/* <Text>{destino}</Text> */}
        {/* <Text>{campeonato}</Text> */}
        <Text>Motorista: {motorista.nome}</Text>
        <Text>Vagas: {qtdVagas}</Text>

        <DefaultButton btnText="Ver Detalhes" btnColor="light" />
        <DefaultButton  btnText="Pedir Carona" btnColor="dark" />

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
