import { View, Text } from "react-native";
import { Solicitacao } from "../../types/request";

export function SolicitationItem({ item }: { item: Solicitacao }) {
  const jogo = item.viagem?.jogo ?? {};

  const statusColors: { [key: string]: string } = {
    pendente: "text-yellow-600",
    aceita: "text-green-600",
    recusada: "text-red-600",
  };

  const statusColorClass = statusColors[item.status] || "text-gray-500";

  return (
    <View className="bg-white rounded-lg border border-gray-300 p-4 mb-4 shadow-md">
      <Text className="text-lg font-bold mb-1 text-gray-800">
        {jogo.nomeEstadio ?? "Estádio N/D"}
      </Text>

      <Text className="text-gray-600 mb-1">
        Data é horario do jogo:{" "}
        <Text className="font-semibold text-gray-800">
          {jogo.dataJogo ? new Date(jogo.dataJogo).toLocaleString() : "N/D"}
        </Text>
      </Text>

      <Text className="text-gray-600 mb-1">
        Motorista:{" "}
        <Text className="font-semibold text-gray-800">
          {item.usuario?.nome_completo ?? "N/D"}
        </Text>
      </Text>

      <Text className="text-gray-600 mb-2">
        Valor:{" "}
        <Text className="font-semibold text-green-700">
          R$ {item.viagem?.valorPorPessoa ?? "N/D"}
        </Text>
      </Text>

      <Text className={`font-bold ${statusColorClass}`}>
        Status: {item.status?.toUpperCase() ?? "N/D"}
      </Text>
    </View>
  );
}
