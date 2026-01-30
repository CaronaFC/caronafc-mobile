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
  currentUserId,
}: CardTravelProps) => {
  const isOwnTravel = currentUserId !== undefined && motorista.id === currentUserId;
  const renderIcon = () => (
    <MaterialCommunityIcons name="stadium-variant" size={24} color="black" />
  );
  const [origemName, setOrigemName] = useState("");
  const navigation = useNavigation<TravelDetailNavigationProp>();

  useEffect(() => {
    let isMounted = true;

    const getOrigemName = async () => {
      try {
        const name = await reverseGeocodeCoords({
          latitude: origemLat,
          longitude: origemLong,
        });
        if (isMounted) {
          setOrigemName(name);
        }
      } catch (error) {
        // Silent fail for geocoding
      }
    };

    if (origemLat && origemLong) {
      getOrigemName();
    }

    return () => {
      isMounted = false;
    };
  }, [origemLat, origemLong]);

  const renderMotoristaAvatar = () => {
    if (motorista.imagem) {
      return (
        <Image
          source={{ uri: motorista.imagem }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "#00FF87",
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#262626",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "#00FF87",
          }}
        >
          <FontAwesome5 name="user-alt" size={20} color="#00FF87" />
        </View>
      );
    }
  };

  return (
    <View className="bg-dark-700 border border-dark-400 rounded-xl overflow-hidden">
      {/* Header do Card */}
      <View className="bg-dark-600/80 p-4 border-b border-accent-primary/20">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <MaterialCommunityIcons name="stadium-variant" size={22} color="#00FF87" />
            <Text className="text-text-primary text-lg font-bold ml-2 flex-1" numberOfLines={1}>
              {jogo.estadio?.nome || "Estádio Indefinido"}
            </Text>
          </View>
          <View className="bg-accent-primary/20 px-3 py-1 rounded-full">
            <Text className="text-accent-primary font-bold text-lg">
              {Number(valorPorPessoa).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </View>
        <Text className="text-accent-muted font-semibold text-sm">
          {jogo.liga?.nome || "Liga Indefinida"}
        </Text>
        <Text className="text-text-primary font-semibold mt-1">
          {jogo.timeCasa?.nome || "Indefinido"} vs {jogo.timeFora?.nome || "Indefinido"}
        </Text>
      </View>

      {/* Body do Card */}
      <View className="p-4 gap-3">
        {origemName && (
          <View className="flex-row items-center">
            <FontAwesome5 name="map-marker-alt" size={14} color="#00D170" />
            <Text className="text-text-secondary ml-2 flex-1">{origemName}</Text>
          </View>
        )}

        <View className="flex-row items-center">
          <FontAwesome5 name="calendar-alt" size={14} color="#00D170" />
          <Text className="text-text-secondary ml-2">
            Jogo: {jogo.data || "Data indefinida"}
          </Text>
        </View>

        <View className="flex-row items-center">
          <FontAwesome5 name="clock" size={14} color="#00D170" />
          <Text className="text-text-secondary ml-2">
            Saída:{" "}
            {new Date(horario).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View className="flex-row items-center bg-dark-600/50 p-2 rounded-lg">
          {renderMotoristaAvatar()}
          <View className="ml-3">
            <Text className="text-text-muted text-xs">Motorista</Text>
            <Text className="text-text-primary font-semibold">{motorista.nome}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <FontAwesome5 name="car" size={14} color="#00D170" />
            <Text className="text-text-secondary ml-2">{veiculo.modelo}</Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesome5 name="users" size={14} color="#00D170" />
            <Text className="text-text-primary font-bold ml-2">{qtdVagas} vagas</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <FontAwesome5
            name={temRetorno ? "exchange-alt" : "long-arrow-alt-right"}
            size={14}
            color={temRetorno ? "#00FF87" : "#666666"}
          />
          <Text className={`ml-2 ${temRetorno ? "text-accent-primary" : "text-text-muted"}`}>
            {temRetorno ? "Com retorno incluído" : "Somente ida"}
          </Text>
        </View>

        <View className="flex-row gap-3 mt-2">
          <DefaultButton
            btnText="Detalhes"
            btnColor="dark"
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("TravelDetail", { id })}
          />
          {!isOwnTravel && (
            <DefaultButton
              onPress={() => handleRequest(id)}
              btnText="Pedir Carona"
              btnColor="primary"
              style={{ flex: 1 }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default CardTravel