import React from "react";

import { View, Text, Image, Pressable } from "react-native";
import HeroImage from "@/assets/images/hero-image.png";
import TextInput from "src/components/commom/TextInput";
import DefaultButton from "src/components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation";
import { useNavigation } from "@react-navigation/native";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;
export default function LoginScreen() {
  const [userNumberOrEmail, setUserNumberOrEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View className="h-screen bg-primaryWhite">
      <View className="relative">
        <Image source={HeroImage} style={{ marginLeft: -20 }} />
        <Text className="absolute font-bold text-3xl top-10 left-10 z-10 text-white">
          CARONA FC
        </Text>
      </View>

      <View className="p-4">
        <View>
          <TextInput
		  	    label="Email ou número de telefone"
            value={userNumberOrEmail}
            setValue={setUserNumberOrEmail}
            placeholder="Email ou telefone"
          />
        </View>
        <View className="mt-4">
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
      <View className="self-center w-36 h-2 bg-primaryBlack rounded-xl my-2" />
    </View>
  );
}
