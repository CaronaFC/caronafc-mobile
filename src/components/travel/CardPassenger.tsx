import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "../../lib/dateFormatters";
import { RequestStatus } from "../../types/request";

type Props = {
  nome: string;
  img: string | null;
  usuarioDesde: string;
  estrelas: number;
  status: RequestStatus;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const CardPassenger = ({
  nome,
  img,
  usuarioDesde,
  estrelas,
  status,
  onConfirm,
  onCancel,
}: Props) => {
  const totalEstrelas = 5;
  const starsArray = Array.from(
    { length: totalEstrelas },
    (_, i) => i < estrelas
  );

  return (
    <View className="flex-row items-center bg-green-500 p-4 rounded-md gap-4">
      <View>
        {img ? (
          <Image
            source={{ uri: img }}
            className="w-12 h-12 rounded-full border border-gray-300"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
            <MaterialIcons name="person" size={24} color="#888" />
          </View>
        )}
      </View>

      {/* Texto e avaliação */}
      <View style={{ flex: 1 }}>
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-semibold">{nome}</Text>
          <View className="flex-row items-center">
            {starsArray.map((filled, idx) =>
              filled ? (
                <FontAwesome key={idx} name="star" size={10} color="yellow" />
              ) : (
                <FontAwesome key={idx} name="star-o" size={8} color="#000" />
              )
            )}
          </View>
        </View>
        <Text className="text-white text-xs">
          Usuário desde: {formatDate(usuarioDesde)}
        </Text>
      </View>
    </View>
  );
};

export default CardPassenger;
