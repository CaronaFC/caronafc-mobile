import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FontAwesome, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
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
    <View style={styles.container}>
      <View>
        {img ? (
          <Image
            source={{ uri: img }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome5 name="user-alt" size={16} color="#00FF87" />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{nome}</Text>
          <View style={styles.starsRow}>
            {starsArray.map((filled, idx) =>
              filled ? (
                <FontAwesome key={idx} name="star" size={10} color="#FFB800" />
              ) : (
                <FontAwesome key={idx} name="star-o" size={10} color="#444" />
              )
            )}
          </View>
        </View>
        <Text style={styles.since}>
          Usuário desde: {formatDate(usuarioDesde)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00FF87',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00FF87',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  since: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
});

export default CardPassenger;
