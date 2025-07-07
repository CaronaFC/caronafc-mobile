import React from "react";

import { View, Text, Image, Pressable, ToastAndroid, KeyboardAvoidingView, Platform } from "react-native";
import HeroImage from "../../assets/images/hero-image.png"
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;
export default function LoginScreen() {
  const { login } = useAuth()
  const [userNumberOrEmail, setUserNumberOrEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showErrors, setShowErros] = React.useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {

    try {
      setIsLoading(true)

      if (!userNumberOrEmail || !userPassword) {
        console.log("Campos mal preenchidos")
        setShowErros(true)
        return;
      }

      const response = await loginUser({
        identificador: userNumberOrEmail,
        senha: userPassword,
      })

      if (!response.data?.token) {
        ToastAndroid.show("Erro ao realizar autenticação do usuário.", ToastAndroid.SHORT);
        return;
      }

      await login(response.data);
      ToastAndroid.show("Login realizado com sucesso", ToastAndroid.SHORT);
    } catch (error: any) {
      setIsLoading(false)
      ToastAndroid.show(error.message || "Erro desconhecido", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <FormScreenWrapper>
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
              showError={showErrors && !userNumberOrEmail}

            />
            <TextInput
              label="Sua senha"
              value={userPassword}
              setValue={setUserPassword}
              placeholder="Senha"
              type="password"
              showError={showErrors && !userPassword}

            />
          </View>
          <View className="gap-y-2 mt-4 justify-center">
            <DefaultButton btnText="Login" onPress={handleSubmit} />
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
    </FormScreenWrapper>
  );
}
