import React from "react";

import { View, Text, Image, Pressable } from "react-native";
import HeroImage from "../../assets/images/hero-image.png"
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;
export default function LoginScreen() {
  const [userNumberOrEmail, setUserNumberOrEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const insets = useSafeAreaInsets();

  return (
    <View className="h-screen bg-primaryWhite"
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }}
    >
      <View className="relative">
        <Image source={HeroImage} style={{ width: "100%" }} />
        <Text className="absolute font-bold text-3xl top-10 left-10 z-10 text-white">
          CARONA FC
        </Text>
      </View>

      <View className="flex-1 p-4">
        <View className="gap-4">
          <TextInput
            label="Email ou número de telefone"
            value={userNumberOrEmail}
            setValue={setUserNumberOrEmail}
            placeholder="Email ou telefone"
          />
          <TextInput
            label="Sua senha"
            value={userPassword}
            setValue={setUserPassword}
            placeholder="Senha"
            type="password"
          />
        </View>
        <View className="gap-y-2 mt-4 justify-center">
          <DefaultButton btnText="Login" />
          <Text className="text-center">OR</Text>
          <DefaultButton
            btnText="Cadastrar-se"
            onPress={() => navigation.navigate("Register")}
          />
          <Pressable>
            <Text className="text-labelColor mt-4 text-center font-bold">
              Recupere sua senha
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
