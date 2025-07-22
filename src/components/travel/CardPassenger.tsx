import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@ui-kitten/components";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { formatDate } from "../../lib/dateFormatters";
import { RequestStatus } from "../../types/request";

type Props = {
  nome: string;
  usuarioDesde: string;
  estrelas: number; // 0 a 5
  status: RequestStatus;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const CardPassenger = ({
  nome,
  usuarioDesde,
  estrelas,
  status,
  onConfirm,
  onCancel,
}: Props) => {
  // Cria array para renderizar estrelas
  const totalEstrelas = 5;
  const starsArray = Array.from(
    { length: totalEstrelas },
    (_, i) => i < estrelas
  );

  return (
    <View
      style={{
        backgroundColor:
          status === "aceita"
            ? "#4ade80"
            : status === "recusada"
            ? "#f87171"
            : "#d1d5db",
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Ícone usuário */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#cbd5e1",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <FontAwesome name="user" size={24} color="#4b5563" />
      </View>

      {/* Texto e avaliação */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#111827" }}>
          {nome}
        </Text>
        <Text style={{ fontSize: 12, color: "#374151" }}>
          Usuário desde: {formatDate(usuarioDesde)}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          {starsArray.map((filled, idx) =>
            filled ? (
              <FontAwesome key={idx} name="star" size={14} color="#000" />
            ) : (
              <FontAwesome key={idx} name="star-o" size={14} color="#000" />
            )
          )}
        </View>
      </View>

      <View style={{ alignItems: "center", marginLeft: 12 }}>
        {status === "aceita" ? (
          <View className="items-center">
            <TouchableOpacity onPress={onConfirm} style={{ marginRight: 8 }}>
              <Ionicons name="checkmark" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-bold mb-2 text-base">Confirmado!</Text>
          </View>
        ) : status === "recusada" ? (
          <View className="items-center">
            <TouchableOpacity onPress={onCancel}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-bold mb-2 text-base">Recusado</Text>
          </View>
        ) : (
          <View className="items-center">
            <TouchableOpacity onPress={onCancel}>
              <FontAwesome5 name="user-clock" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-bold mb-2 text-base">Pendente</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CardPassenger;
