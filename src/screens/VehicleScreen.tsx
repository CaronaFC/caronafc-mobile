import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { getUserById } from "../services/userService";
import { deleteVehicleId } from "../services/vehicleService";
import { useAuth } from "../context/AuthContext";

type Vehicle = {
  id: number;
  placa: string;
  renavam: string;
  marca: string;
  modelo: string;
  cor: string;
  tipoVeiculo: {
    id: number;
    descricao: string;
  };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Vehicle"
>;

export default function VehicleScreen() {
  const [selectedType, setSelectedType] = useState<"Carro" | "Moto">("Carro");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [openMenuForId, setOpenMenuForId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<Boolean>(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { userData, userToken } = useAuth();

  const open = (boolean: Boolean) => {
    setMenuOpen(boolean);
    setOpenMenuForId(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  const fetchUser = async () => {
    const response = await getUserById(Number(userData?.data?.id));
    setVehicles(response?.data.data.veiculos);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (vehicleId: number) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir este veículo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteVehicleId(vehicleId);
              setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
              setOpenMenuForId(null);
            } catch (error) {
              console.error("Erro ao deletar:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (vehicleId: number) => {
    setOpenMenuForId(null);
    // navigation.navigate("VehicleEdit", { id: vehicleId });
  };

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00FF87"
            colors={['#00FF87']}
          />
        }
      >
        <Text style={styles.title}>Meus Veículos</Text>

        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.cardHeader}>
              <FontAwesome5
                name={
                  vehicle.tipoVeiculo.descricao === "Carro"
                    ? "car"
                    : "motorcycle"
                }
                size={24}
                color="#00FF87"
              />
              <Text style={styles.vehicleModel}>{vehicle.modelo}</Text>
            </View>

            <View style={styles.cardDetails}>
              <Text style={styles.detailText}>Marca: {vehicle.marca}</Text>
              <Text style={styles.detailText}>Placa: {vehicle.placa}</Text>
              <Text style={styles.detailText}>RENAVAM: {vehicle.renavam}</Text>
              <View style={styles.colorRow}>
                <Text style={styles.detailText}>Cor: {vehicle.cor}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                const isOpen = openMenuForId === vehicle.id;
                setOpenMenuForId(isOpen ? null : vehicle.id);
                setMenuOpen(!isOpen);
              }}
              style={styles.menuButton}
            >
              <Text style={styles.menuButtonText}>⋮</Text>
            </TouchableOpacity>

            {openMenuForId === vehicle.id && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  onPress={() => handleDelete(vehicle.id)}
                  style={styles.deleteButton}
                >
                  <FontAwesome5 name="trash" size={14} color="#FF4444" />
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {vehicles.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="car" size={48} color="#2A2A2A" />
            <Text style={styles.emptyText}>
              Nenhum veículo cadastrado
            </Text>
            <Text style={styles.emptySubtext}>
              Adicione seu primeiro veículo para começar
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  vehicleCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  vehicleModel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  cardDetails: {
    gap: 4,
  },
  detailText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 16,
    top: 56,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    overflow: 'hidden',
    zIndex: 100,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deleteText: {
    color: '#FF4444',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    marginTop: 8,
  },
});
