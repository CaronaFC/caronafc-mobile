import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

import { SolicitationItem } from "../components/requests/SolicitationItem";
import { fetchSolicitationPassenger } from "../services/requestsService";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MyTravelRequests"
>;

interface Jogo {
  nomeEstadio?: string;
  dataJogo?: string;
}

interface Usuario {
  nome_completo?: string;
}

interface Viagem {
  jogo?: Jogo;
  valorPorPessoa?: string;
}

interface Solicitacao {
  id: number;
  status: string;
  usuario?: Usuario;
  viagem?: Viagem;
  dataSolicitacao: string;
}

export default function MyTravelRequestsScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSolicitacoes = async () => {
    try {
      const res = await fetchSolicitationPassenger();
      setSolicitacoes(res);
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSolicitacoes();
  }, []);

  if (loading) {
    return (
      <View className="p-4">
        <Text className="text-center text-xl">Carregando solicitações...</Text>
      </View>
    );
  }

  return (
    <FlatList
      className="p-4"
      data={solicitacoes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <SolicitationItem item={item} />}
      ListEmptyComponent={
        <View>
          <Text className="text-center text-xl">
            Nenhuma solicitação encontrada.
          </Text>
        </View>
      }
    />
  );
}
