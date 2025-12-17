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
import { LinearGradient } from "expo-linear-gradient";

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
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(error.message || "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dark-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="relative">
            <Image source={HeroImage} style={{ width: "100%", opacity: 0.8 }} />
            <LinearGradient
              colors={['transparent', '#0D0D0D']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
              }}
            />
            <Text className="absolute font-bold text-3xl top-10 left-10 z-10 text-accent-primary">
              CARONA FC
            </Text>
          </View>

          <View className="flex-1 p-6 -mt-6">
            <View className="bg-dark-700/80 rounded-2xl p-6 border border-dark-400">
              <Text className="text-text-primary text-xl font-bold mb-6 text-center">
                Bem-vindo de volta
              </Text>

              <View className="gap-4">
                <TextInput
                  label="Email ou telefone"
                  value={userNumberOrEmail}
                  setValue={(text) => setUserNumberOrEmail(text.trim().toLowerCase())}
                  autoCapitalize="none"
                  placeholder="Digite seu email ou telefone"
                  showError={showErrors && !userNumberOrEmail}
                />
                <TextInput
                  label="Senha"
                  value={userPassword}
                  setValue={setUserPassword}
                  placeholder="Digite sua senha"
                  type="password"
                  showError={showErrors && !userPassword}
                />
              </View>

              <View className="gap-y-3 mt-6">
                <DefaultButton
                  btnText={isLoading ? "Entrando..." : "Entrar"}
                  onPress={handleSubmit}
                  disabled={isLoading}
                />

                <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                  <Text className="text-text-secondary text-center">
                    Esqueceu sua senha?
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="mt-8 items-center">
              <Text className="text-text-muted mb-2">Não tem uma conta?</Text>
              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text className="text-accent-primary font-bold text-lg">
                  Criar conta
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
