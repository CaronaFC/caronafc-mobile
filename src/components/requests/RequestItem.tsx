import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Request } from "../../types/request";

export function RequestItem({ item }: { item: Request  }) {
  const statusColors: { [key: string]: string } = {
    pendente: "text-yellow-600",
    aceita: "text-green-600",
    recusada: "text-red-600",
  };

  const statusColorClass = statusColors[item.status] || "text-gray-500";

  return (
    <View className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="futbol" size={16} color="#2563EB" />
        <Text className="text-gray-700 font-semibold ms-2">{item.viagem.jogo.timeCasa?.nome ?? "Indefinido"} x {item.viagem.jogo?.timeFora?.nome ?? "Indefinido"}</Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="trophy" size={16} color="#EF4444" />
        <Text className="text-gray-700 font-semibold ms-2">Liga: {item.viagem.jogo?.liga?.nome ?? "Indefinida"}</Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="landmark" size={16} color="#10B981" />
        <Text className="text-gray-700 font-semibold ms-2">
          Estádio: {item.viagem.jogo?.estadio?.nome || "Não informado"}
        </Text>
      </View>

      <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="clock" size={16} color="#6366F1" />
        <Text className="text-gray-700 font-semibold ms-2">
          Data: {item.viagem.jogo?.data || "Indefinida"}
        </Text>
      </View>

      <View
        className="my-4 border-b border-gray-300"
      />

      <View className="flex-row items-center space-x-1">
        <FontAwesome5 name="clock" size={16} color="#6366F1" />
        <Text className="text-gray-800 ms-3 font-semibold">
          Saída:{" "}
          {new Date(item.viagem.horario).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-row items-center space-x-1">
          <FontAwesome5 name="money-bill-wave" size={16} color="#22C55E" />
          <Text className="text-gray-700 font-semibold ms-2">
            {item.viagem.valorPorPessoa ? `R$ ${Number(item.viagem.valorPorPessoa).toFixed(2)}` : "Grátis"} /pessoa
          </Text>
        </View>
      </View>

      <View className="flex-row items-center space-x-2">
        <FontAwesome name="drivers-license-o" size={16} color="#6366F1" />
        <Text className="text-gray-700 font-semibold ms-2">
          Motorista: {item.viagem.motorista.nome_completo ?? "Indefinida"}
        </Text>
      </View>
       <View className="flex-row items-center space-x-2 mb-1">
        <FontAwesome5 name="car" size={16} color="#6366F1" />
        <Text className="text-gray-700 font-semibold ms-2">
          Veículo: {item.viagem.veiculo.modelo || "Indefinida"}
        </Text>
      </View>
       <View className="flex-row items-center space-x-2 font-bold">
        <Text className="text-gray-700 font-semibold">
          Status:
          <Text className={`ms-2 ${statusColorClass}`}>
            {item.status?.toUpperCase() ?? "N/D"}
          </Text>
        </Text>
      </View>
    </View>
  );
}
