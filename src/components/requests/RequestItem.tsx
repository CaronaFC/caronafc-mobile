import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Request } from "../../types/request";

export function RequestItem({ item }: { item: Request  }) {
  const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
    pendente: { color: "#FFB800", bgColor: "rgba(255, 184, 0, 0.15)" },
    aceita: { color: "#00FF87", bgColor: "rgba(0, 255, 135, 0.15)" },
    recusada: { color: "#FF4444", bgColor: "rgba(255, 68, 68, 0.15)" },
  };

  const status = statusConfig[item.status] || { color: "#AAAAAA", bgColor: "rgba(170, 170, 170, 0.15)" };

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
      <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
        <Text style={[styles.statusText, { color: status.color }]}>
          {item.status?.toUpperCase() ?? "N/D"}
        </Text>
      </View>
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
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
