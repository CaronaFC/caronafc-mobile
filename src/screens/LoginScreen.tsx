import React from "react";

import {
  View,
  Text,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import HeroImage from "../../assets/images/hero-image.png";
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
  const { login } = useAuth();
  const [userNumberOrEmail, setUserNumberOrEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showErrors, setShowErros] = React.useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!userNumberOrEmail || !userPassword) {
        console.log("Campos mal preenchidos");
        setShowErros(true);
        return;
      }

      const response = await loginUser({
        identificador: userNumberOrEmail,
        senha: userPassword,
      });

      if (!response.data?.token) {
        Alert.alert("Erro ao realizar autenticação do usuário.");
        return;
      }

      await login(response.data);
      Alert.alert("Login realizado com sucesso");
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(error.message || "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: "white",
          }}
          keyboardShouldPersistTaps="handled"
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
                setValue={(text) => setUserNumberOrEmail(text.trim().toLowerCase())}
                autoCapitalize="none"
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
              <DefaultButton btnText={isLoading ? "Acessando..." : "Login" }onPress={handleSubmit} />
              <Text className="text-center">OR</Text>
              <DefaultButton
                btnText="Criar conta"
                onPress={() => navigation.navigate("Register")}
              />
              <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                <Text className="text-labelColor mt-4 text-center font-bold">
                  Recupere sua senha
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormScreenWrapper>
  );
}
