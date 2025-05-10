import React from "react";

import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [userName, setUserName] = React.useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          color: "black",
          fontSize: 28,
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        Login CaronaFC
      </Text>
      <TextInput
        label="Nome"
        value={userName}
        onChange={(text) => setUserName(text.nativeEvent.text)}
        style={{ marginBottom: 20 }}
        placeholder="Digite seu nome"
      />
      <Button
        icon="arrow-right"
        mode="contained"
        contentStyle={{ flexDirection: "row-reverse" }}
        buttonColor="lightgreen"
        textColor="white"
        onPress={
          () => {
            setUserName("");
            return navigation.navigate("Home", { user: { name: userName || 'Desconhecido' } })
          }
        }
      >
        Acessar
      </Button>
    </View>
  );
}
