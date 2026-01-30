import React from "react";

import {
  View,
  Text,
  ImageBackground,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import HeroImage from "../../assets/images/hero.png";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    <ImageBackground
      source={HeroImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.65)', '#000000ff']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
            {/* Logo / Title */}
            <View style={styles.headerSection}>
              <Text style={styles.logoText}>CaronaFC</Text>
              <Text style={styles.tagline}>Sua carona para a vitória! 🏆</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.formCard}>
                <Text style={styles.welcomeText}>
                  Bem-vindo de volta
                </Text>

                <View style={styles.inputsContainer}>
                  <TextInput
                    label="Email ou telefone"
                    value={userNumberOrEmail}
                    setValue={(text) => setUserNumberOrEmail(text.trim().toLowerCase())}
                    autoCapitalize="none"
                    placeholder="Digite seu email ou telefone"
                    showError={showErrors && !userNumberOrEmail}
                    keyboardType="email-address"
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

                <View style={styles.actionsContainer}>
                  <DefaultButton
                    btnText={isLoading ? "Entrando..." : "Entrar"}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  />

                  <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.forgotText}>
                      Esqueceu sua senha?
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.registerSection}>
                <Text style={styles.noAccountText}>Não tem uma conta?</Text>
                <Pressable onPress={() => navigation.navigate("Register")}>
                  <Text style={styles.registerText}>
                    Cadastre-se!
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00FF87',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#FFFFFF',
    marginTop: 8,
  },
  formSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputsContainer: {
    gap: 16,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 24,
  },
  forgotText: {
    color: '#AAAAAA',
    textAlign: 'center',
    fontSize: 14,
  },
  registerSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  noAccountText: {
    color: '#666666',
    marginBottom: 8,
  },
  registerText: {
    color: '#00FF87',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
