import React from "react";

import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [userName, setUserName] = React.useState("");

  return (
    <View
      className="flex-1 items-center justify-center bg-gradient-to-br from-green-500 to-gray-900"
    >
      <Text
        className="text-2xl font-bold mb-4 text-neutral-50"
      >
        Login CaronaFC
      </Text>
      <TextInput
        className="border border-gray-300 rounded p-2 w-64 bg-neutral-50 "
        value={userName}
        onChange={(text) => setUserName(text.nativeEvent.text)}
        style={{ marginBottom: 20 }}
        placeholder="Digite seu nome"
      />
      <TouchableOpacity
        className="bg-green-500 rounded p-2 w-64"
        onPress={
          () => {
            setUserName("");
            return navigation.navigate(
              "Home",
              {
                user: {
                  name: userName || 'Desconhecido',
                },
              },
            )
          }
        }
      >
        <Text className="text-white text-center">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
