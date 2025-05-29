import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import DefaultButton from "../commom/DefaultButton";
import Flamengo from "@/assets/images/teams/flamengo.png";
import Palmeiras from "@/assets/images/teams/palmeiras.png";
type Props = {};

const CardTravel = (props: Props) => {
  const renderIcon = () => <FontAwesome5 name="arrow-right" size={15} />;
  return (
    <View className="bg-secondaryWhite border-2 border-[#BBF7D0] rounded-md">
      <View className="flex-row justify-between bg-[#F0FDF4] p-3">
        <View>
          <Text className="text-lg">
            Centro {renderIcon()} Estádio Municipal{" "}
          </Text>
          <Text className="text-base">Flamengo vs Palmeiras</Text>
        </View>
        <Text className="text-lg text-black">R$ 22</Text>
      </View>
      <View className=" gap-2 relative bg-[#F8F8F8] p-3">
        <Text>25/04/2025</Text>
        <Text>Estádio Municipal</Text>
        <Text>7.2 km</Text>
        <Text>Brasileirão</Text>
        <Text>Motorista: Jair Bolsonaro</Text>
        <View className="flex-row justify-between items-baseline">
          <Text>4 vagas disponiveis</Text>
          <DefaultButton btnText="Ver Detalhes" btnColor="light" />
        </View>
        <View className="flex-row gap-2 absolute top-[-14] right-4 ">
          <Image source={Flamengo} style={{ width: 42, height: 42 }} />
          <Image source={Palmeiras} style={{ width: 42, height: 42 }} />
        </View>
      </View>
    </View>
  );
};

export default CardTravel;

const styles = StyleSheet.create({});
