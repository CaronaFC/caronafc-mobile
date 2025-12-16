import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from "react-native";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";
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

              <View className="gap-4">
                <TextInput
                  label="Token"
                  value={userCode}
                  keyboardType="number-pad"
                  setValue={setUserCode}
                  placeholder="digite o token enviado para seu email"
                  type="text"
                  showError={showErrors && !userNewConfirmPassword}
                />
                <TextInput
                  label="Senha nova"
                  value={userNewPassword}
                  setValue={setUserNewPassword}
                  placeholder="Senha"
                  type="password"
                  showError={showErrors && !userNewPassword}
                />
                <TextInput
                  label="Repita sua  senha"
                  value={userNewConfirmPassword}
                  setValue={setUserNewConfirmPassword}
                  placeholder="Repita sua senha"
                  type="password"
                  showError={showErrors && !userNewConfirmPassword}
                />
              </View>

              <DefaultButton
                btnText={isLoading ? "Enviando..." : "Enviar"}
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </FormScreenWrapper>
  );
}
