import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Request } from "../../types/request";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "MyTravelRequests">;

type RequestItemProps = {
  item: Request;
  onDelete?: (id: number) => void;
};

export function RequestItem({ item, onDelete }: RequestItemProps) {
  const navigation = useNavigation<NavigationProp>();

  const statusConfig: { [key: string]: { color: string; bgColor: string; label: string } } = {
    pendente: { color: "#FFB800", bgColor: "rgba(255, 184, 0, 0.15)", label: "PENDENTE" },
    aceita: { color: "#00FF87", bgColor: "rgba(0, 255, 135, 0.15)", label: "ACEITA" },
    recusada: { color: "#FF4444", bgColor: "rgba(255, 68, 68, 0.15)", label: "RECUSADA" },
  };

  const viagemStatusConfig: { [key: string]: { color: string; bgColor: string; label: string } } = {
    espera: { color: "#FFB800", bgColor: "rgba(255, 184, 0, 0.15)", label: "Aguardando início" },
    andamento: { color: "#00FF87", bgColor: "rgba(0, 255, 135, 0.15)", label: "Em andamento" },
    finalizada: { color: "#3B82F6", bgColor: "rgba(59, 130, 246, 0.15)", label: "Finalizada" },
  };

  const status = statusConfig[item.status] || { color: "#AAAAAA", bgColor: "rgba(170, 170, 170, 0.15)", label: "N/D" };
  const viagemStatus = viagemStatusConfig[item.viagem?.status] || null;

  // Can track if request is accepted and travel is waiting or in progress
  const canTrackRide = item.status === "aceita" &&
    (item.viagem?.status === "espera" || item.viagem?.status === "andamento");

  const isRideInProgress = item.viagem?.status === "andamento";

  const handleTrackRide = () => {
    navigation.navigate("TravelProgress", { id: item.viagem.id });
  };

  const handleDelete = () => {
    Alert.alert(
      "Cancelar Solicitação",
      "Tem certeza que deseja cancelar esta solicitação de carona?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => onDelete?.(item.id),
        },
      ]
    );
  };

  const canDelete = item.status === "pendente" && onDelete;

  return (
    <View style={styles.card}>
      {/* Match Info */}
      <View style={styles.matchHeader}>
        <FontAwesome5 name="futbol" size={16} color="#00FF87" />
        <Text style={styles.matchText}>
          {item.viagem.jogo.timeCasa?.nome ?? "Indefinido"} x {item.viagem.jogo?.timeFora?.nome ?? "Indefinido"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <FontAwesome5 name="trophy" size={14} color="#00D170" />
        <Text style={styles.infoText}>Liga: {item.viagem.jogo?.liga?.nome ?? "Indefinida"}</Text>
      </View>

      <View style={styles.infoRow}>
        <FontAwesome5 name="landmark" size={14} color="#00D170" />
        <Text style={styles.infoText}>
          Estádio: {item.viagem.jogo?.estadio?.nome || "Não informado"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <FontAwesome5 name="calendar-alt" size={14} color="#00D170" />
        <Text style={styles.infoText}>
          Data: {item.viagem.jogo?.data || "Indefinida"}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <FontAwesome5 name="clock" size={14} color="#00D170" />
        <Text style={styles.infoText}>
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

      <View style={styles.infoRow}>
        <FontAwesome5 name="money-bill-wave" size={14} color="#00D170" />
        <Text style={styles.infoText}>
          {item.viagem.valorPorPessoa ? `R$ ${Number(item.viagem.valorPorPessoa).toFixed(2)}` : "Grátis"} /pessoa
        </Text>
      </View>

      <View style={styles.infoRow}>
        <FontAwesome name="drivers-license-o" size={14} color="#00D170" />
        <Text style={styles.infoText}>
          Motorista: {item.viagem.motorista.nome_completo ?? "Indefinida"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <FontAwesome5 name="car" size={14} color="#00D170" />
        <Text style={styles.infoText}>
          Veículo: {item.viagem.veiculo.modelo || "Indefinida"}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        {item.status === "aceita" && viagemStatus && (
          <View style={[styles.statusBadge, { backgroundColor: viagemStatus.bgColor }]}>
            <FontAwesome5
              name={isRideInProgress ? "car" : "hourglass-half"}
              size={10}
              color={viagemStatus.color}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.statusText, { color: viagemStatus.color }]}>
              {viagemStatus.label}
            </Text>
          </View>
        )}
      </View>

      {/* Track Ride Button */}
      {canTrackRide && (
        <TouchableOpacity
          onPress={handleTrackRide}
          style={[
            styles.trackButton,
            isRideInProgress && styles.trackButtonActive
          ]}
          activeOpacity={0.8}
        >
          <FontAwesome5
            name={isRideInProgress ? "location-arrow" : "map-marked-alt"}
            size={16}
            color={isRideInProgress ? "#0D0D0D" : "#00FF87"}
          />
          <Text style={[
            styles.trackButtonText,
            isRideInProgress && styles.trackButtonTextActive
          ]}>
            {isRideInProgress ? "Acompanhar Viagem" : "Ver no Mapa"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Delete Button - only for pending requests */}
      {canDelete && (
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="trash-alt" size={14} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Cancelar Solicitação</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  matchText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  infoText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF87',
    backgroundColor: 'transparent',
  },
  trackButtonActive: {
    backgroundColor: '#00FF87',
    borderColor: '#00FF87',
  },
  trackButtonText: {
    color: '#00FF87',
    fontSize: 16,
    fontWeight: '600',
  },
  trackButtonTextActive: {
    color: '#0D0D0D',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
