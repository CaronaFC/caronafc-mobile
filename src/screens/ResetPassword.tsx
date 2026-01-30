import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { resetPasswordUser } from "../services/authService";

type ResetPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ResetPassword"
>;

export default function ResetPassword() {
  const navigation = useNavigation<ResetPasswordNavigationProp>();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = React.useState(false);

  const [userNewPassword, setUserNewPassword] = React.useState("");
  const [userNewConfirmPassword, setUserNewConfirmPassword] =
    React.useState("");
  const [userCode, setUserCode] = React.useState("");
  const [showErrors, setShowErrors] = React.useState(false);
  type ResetPasswordRouteProp = RouteProp<RootStackParamList, "ResetPassword">;
  const route = useRoute<ResetPasswordRouteProp>();
  const email = route.params?.email;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!email) {
        Alert.alert("Email não informado. Retorne e tente novamente.");
        return;
      }
      if (!userNewPassword || !userNewConfirmPassword || !userCode) {
        Alert.alert("Preencha todos os campos.");
        return;
      }

      if (userNewPassword !== userNewConfirmPassword) {
        Alert.alert("As senhas não coincidem.");
        return;
      }

      const msg = await resetPasswordUser({
        email: email,
        code: userCode,
        newPassword: userNewPassword,
      });
      Alert.alert("Senha alterada com sucesso.");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert(error.message || "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="key" size={32} color="#00FF87" />
            </View>
          </View>

          <Text style={styles.title}>Nova Senha</Text>
          <Text style={styles.subtitle}>
            Digite o código recebido no email e sua nova senha
          </Text>

          <View style={styles.formCard}>
            <View style={styles.inputsContainer}>
              <TextInput
                label="Token"
                value={userCode}
                keyboardType="number-pad"
                setValue={setUserCode}
                placeholder="Digite o token enviado para seu email"
                type="text"
                showError={showErrors && !userCode}
              />
              <TextInput
                label="Nova senha"
                value={userNewPassword}
                setValue={setUserNewPassword}
                placeholder="Digite sua nova senha"
                type="password"
                showError={showErrors && !userNewPassword}
              />
              <TextInput
                label="Confirme sua senha"
                value={userNewConfirmPassword}
                setValue={setUserNewConfirmPassword}
                placeholder="Repita sua nova senha"
                type="password"
                showError={showErrors && !userNewConfirmPassword}
              />
            </View>

            <View style={{ marginTop: 24 }}>
              <DefaultButton
                btnText={isLoading ? "Alterando..." : "Alterar senha"}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#00FF87',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  inputsContainer: {
    gap: 16,
  },
});
