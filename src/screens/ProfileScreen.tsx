import React from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import MenuItem from "../components/profile/MenuItem";
import { useAuth } from "../context/AuthContext";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const { userData, userToken, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {userData?.data?.imagem ? (
            <Image
              source={{ uri: userData.data.imagem }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome5 name="user-alt" size={40} color="#00FF87" />
            </View>
          )}
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#00FF87" />
          </View>
        </View>

        <Text style={styles.userName}>
          {userData?.data?.nome_completo ?? "Usuário"}
        </Text>

        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#0D0D0D" />
          <Text style={styles.ratingText}>0 avaliações</Text>
        </View>
      </View>

      {/* Menu Section 1 */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Minha Conta</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<FontAwesome5 name="car" size={18} color="#00FF87" />}
            label="Meus Veículos"
            onPress={() => navigation.navigate("Vehicle")}
          />
          <MenuItem
            icon={<Ionicons name="time-outline" size={20} color="#00FF87" />}
            label="Histórico de Caronas"
            onPress={() => navigation.navigate('History')}
          />
          <MenuItem
            icon={<Ionicons name="star-outline" size={20} color="#00FF87" />}
            label="Minhas Avaliações"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Menu Section 2 */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<Feather name="settings" size={18} color="#00FF87" />}
            label="Editar Perfil"
            onPress={() => navigation.navigate("UpdateUser", { usuario: userData?.data })}
          />
          <MenuItem
            icon={<Feather name="log-out" size={18} color="#FF4444" />}
            label="Sair da Conta"
            onPress={() => logout()}
            danger
          />
        </View>
      </View>

      {/* App Version */}
      <Text style={styles.versionText}>Carona FC v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00FF87',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00FF87',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    padding: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00FF87',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D0D0D',
  },
  menuSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  versionText: {
    textAlign: 'center',
    color: '#444444',
    fontSize: 12,
    marginTop: 32,
  },
});
