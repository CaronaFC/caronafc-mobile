import React, { useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext"
import MenuItem from "../components/profile/MenuItem";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const { userData, userToken, logout } = useAuth();

  console.log("userData", userData)
  console.log("userToken", userToken)

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <View className="items-center my-4">
        <Ionicons name="person-circle" size={80} color="#aaa" />
        <Text className="text-lg font-semibold mt-2">
          {userData?.data.nome_completo ?? "Usuário Desconhecido"}
        </Text>
        <View className="flex-row items-center bg-gray-200 px-2 py-1 rounded-full mt-1">
          <Text className="text-xs font-bold mr-1">0</Text>
          <Ionicons name="star" size={12} color="black" />
        </View>
      </View>

      <View className="border-t border-b border-gray-300">
        <MenuItem
          icon={<FontAwesome5 name="motorcycle" size={20} />}
          label="Veículos"
          onPress={() => navigation.navigate("Vehicle")} />
        <MenuItem icon={<Ionicons name="time" size={20} />} label="Histórico de Caronas" />
        <MenuItem icon={<Feather name="credit-card" size={20} />}
         label="Carteira"
          />
      </View>

      <View className="border-t border-b border-gray-300 mt-4">
        <MenuItem icon={<Feather name="user" size={20} />} label="Alterar dados"
        onPress={() => navigation.navigate("Updateuser",{usuario:userData?.data})} />
        <MenuItem
          icon={<Feather name="log-out" size={20} />}
          label="Sair"
          onPress={() => {
            logout()
          }
          }
        />
      </View>
    </ScrollView>
  );
}
