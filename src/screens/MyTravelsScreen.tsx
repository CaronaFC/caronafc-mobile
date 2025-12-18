import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getTravels, deleteTravel } from "../services/travelService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { TravelAPIResponseType } from "../types/travel";
import { PassengerType } from "../types/passanger";

type Props = {};

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MyTravelsScreen"
>;

export default function MyTravelsScreen({}: Props) {
  const { userData } = useAuth();
  const [travels, setTravels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const fetchTravels = useCallback(async () => {
    if (!userData?.data?.id) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getTravels({ motoristaId: userData.data.id });
      setTravels(data);
    } catch (err) {
      setError("Erro ao carregar viagens.");
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  const handleDeleteTravel = (travelId: number, travelName: string) => {
    Alert.alert(
      "Excluir Viagem",
      `Tem certeza que deseja excluir a viagem para "${travelName}"?\n\nEssa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTravel(travelId);
              setTravels((prev) => prev.filter((t) => t.id !== travelId));
              Alert.alert("Sucesso", "Viagem excluída com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a viagem.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-dark-900">
        <ActivityIndicator size="large" color="#00FF87" />
        <Text className="mt-2 text-accent-primary font-semibold">
          Carregando suas viagens...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-dark-900">
        <Text className="text-red-500 mb-4 text-center font-semibold">
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchTravels}
          style={{ backgroundColor: '#00FF87', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
          activeOpacity={0.8}
        >
          <Text className="text-dark-900 font-bold text-lg">
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderStatusColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      espera: "#F59E0B",
      andamento: "#00FF87",
      finalizada: "#10B981",
    }

    return statusColorMap[status] || "#666666";
  };

  const renderStatusName = (status: string) => {
    const statusNameMap: { [key: string]: string } = {
      espera: "Aguardando início",
      andamento: "Em andamento",
      finalizada: "Finalizada",
    };

    return statusNameMap[status] || "Indefinido";
  };

  const renderPassengerAvatar = (passageiro: PassengerType) => {
    if (passageiro.imagem) {
      return (
        <Image
          source={{ uri: passageiro.imagem }}
          style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#00FF87' }}
        />
      );
    }
    return (
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#00FF87' }}>
        <Ionicons name="person" size={16} color="#00FF87" />
      </View>
    );
  };

  const renderItem = ({ item }: { item: TravelAPIResponseType }) => (
    <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
      <View className="flex-row items-center gap-2 mb-2">
        <FontAwesome5 name="futbol" size={16} color="#00FF87" />
        <Text
          style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}
          numberOfLines={1}
        >
          {item.jogo?.timeCasa?.nome ?? "Indefinido"} x{" "}
          {item.jogo?.timeFora?.nome ?? "Indefinido"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="trophy" size={14} color="#00D170" />
        <Text style={{ color: '#AAAAAA' }}>
          {item.jogo?.liga?.nome ?? "Liga Indefinida"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="landmark" size={14} color="#00D170" />
        <Text style={{ color: '#AAAAAA' }}>
          {item.jogo?.estadio?.nome || "Estádio não informado"}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <FontAwesome5 name="calendar-alt" size={14} color="#00D170" />
        <Text style={{ color: '#AAAAAA' }}>
          {item.jogo?.data || "Data indefinida"}
        </Text>
      </View>

      <View style={{ height: 1, backgroundColor: '#2A2A2A', marginVertical: 12 }} />

      <View className="flex-row items-center gap-2 mb-2">
        <FontAwesome5 name="clock" size={14} color="#00D170" />
        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
          Saída:{" "}
          {new Date(item.horario).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <FontAwesome5 name="users" size={14} color="#00D170" />
          <Text style={{ color: '#AAAAAA' }}>
            {item.qtdVagas} vagas
          </Text>
        </View>
        <View style={{ backgroundColor: '#00FF87', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ color: '#0D0D0D', fontWeight: '700' }}>
            {item.valorPorPessoa
              ? `R$ ${Number(item.valorPorPessoa).toFixed(2)}`
              : "Grátis"}
          </Text>
        </View>
      </View>

      <Text style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: 8 }}>Passageiros:</Text>
      {item.passageiros && item.passageiros.length > 0 ? (
        item.passageiros.map((passageiro: PassengerType) => (
          <View
            key={passageiro.id}
            className="flex-row items-center gap-3 mb-2"
          >
            {renderPassengerAvatar(passageiro)}
            <Text style={{ color: '#FFFFFF' }}>
              {passageiro.nome_completo}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: '#666666', fontStyle: 'italic' }}>Nenhum passageiro</Text>
      )}

      <View className="flex-row items-center gap-2 mt-3">
        <FontAwesome5 name="info-circle" size={14} color={renderStatusColor(item.status)} />
        <Text style={{ color: renderStatusColor(item.status), fontWeight: '500' }}>{renderStatusName(item.status)}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => {
            if (item.status === "finalizada") {
              Alert.alert("Viagem finalizada", "Esta viagem já foi concluída.");
              return;
            }
            navigation.navigate("TravelProgress", { id: item.id });
          }}
          style={{ flex: 1, backgroundColor: '#00FF87', borderRadius: 12, paddingVertical: 12 }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#0D0D0D', fontWeight: '700', textAlign: 'center' }}>Acompanhar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TravelRequests", {
              id: item.id,
              travel: item.jogo?.estadio?.nome,
            })
          }
          style={{ flex: 1, backgroundColor: '#262626', borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#00FF87' }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#00FF87', fontWeight: '700', textAlign: 'center' }}>
            Solicitações
          </Text>
        </TouchableOpacity>
      </View>

      {item.status === "espera" && (
        <TouchableOpacity
          onPress={() => handleDeleteTravel(
            item.id,
            `${item.jogo?.timeCasa?.nome ?? "Time"} x ${item.jogo?.timeFora?.nome ?? "Time"}`
          )}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: '#1A1A1A',
            borderRadius: 12,
            paddingVertical: 12,
            marginTop: 12,
            borderWidth: 1,
            borderColor: '#FF4444'
          }}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="trash" size={14} color="#FF4444" />
          <Text style={{ color: '#FF4444', fontWeight: '600' }}>
            Excluir Viagem
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0D0D0D' }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: '#00FF87', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
          Minhas Viagens
        </Text>
        <Text style={{ color: '#888888', fontSize: 14 }}>
          Gerencie suas viagens como motorista
        </Text>
      </View>

      <TouchableOpacity
        onPress={fetchTravels}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A', paddingVertical: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' }}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="sync" size={16} color="#00FF87" />
        <Text style={{ color: '#00FF87', marginLeft: 8, fontWeight: '600' }}>
          Atualizar Lista
        </Text>
      </TouchableOpacity>

      {travels.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🚗</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
            Nenhuma viagem cadastrada
          </Text>
          <Text style={{ color: '#666666', textAlign: 'center', marginTop: 8 }}>
            Crie uma viagem para oferecer carona
          </Text>
        </View>
      ) : (
        <FlatList
          data={travels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
