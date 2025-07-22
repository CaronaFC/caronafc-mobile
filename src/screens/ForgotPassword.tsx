import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { forgotPasswordUser } from "../services/authService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

export default function ForgotPassword() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [showErrors, setShowErrors] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!email) {
        setShowErrors(true);
        Alert.alert("Informe seu email.");
        return;
      }

      const msg = await forgotPasswordUser({
        email: email,
      });
      Alert.alert("Código enviado para seu email.");
      navigation.navigate("ResetPassword",{email});
    } catch (error: any) {
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
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: "white",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 16,
              justifyContent: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="gap-4">
              <Text className="text-2xl font-bold text-center mb-4">
                Recuperar Senha
              </Text>

              <TextInput
                label="Email"
                value={email}
                setValue={(text) => setEmail(text.trim().toLowerCase())}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Digite seu email da conta que quer recuperar"
                showError={showErrors && !email}
              />

              <DefaultButton btnText={isLoading ? "Enviando..." : "Enviar"} onPress={handleSubmit} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </FormScreenWrapper>
  );
}