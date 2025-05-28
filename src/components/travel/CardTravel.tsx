import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { SecundaryButton } from "../commom/SecundaryButton";
type Props = {};

const CardTravel = (props: Props) => {
  const renderIcon = () => <FontAwesome5 name="arrow-right" size={15} />;
  return (
    <View>
      <View className="flex-row justify-between">
        <View>
          <Text> Centro {renderIcon()} Estádio Municipal </Text>
          <Text>Flamengo vs Palmeiras</Text>
        </View>
        <Text>R$ 22</Text>
      </View>
      <View>
        <Text>25/04/2025</Text>
        <Text>Estádio Municipal</Text>
        <Text>7.2 km</Text>
        <Text>Brasileirão</Text>
        <Text>Motorista: Jair Bolsonaro</Text>
        <View>
          <Text>4 vagas disponiveis</Text>
          <SecundaryButton btnText="Ver Detalhes" />
        </View>
      </View>
    </View>
  );
};

export default CardTravel;

const styles = StyleSheet.create({});
