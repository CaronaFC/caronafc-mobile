import React from "react";
import {
  View,
  Text,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";

type ResetPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ResetPassword"
>;

export default function ResetPassword() {
  const navigation = useNavigation<ResetPasswordNavigationProp>();
  const insets = useSafeAreaInsets();

  const [userNewPassword, setUserNewPassword] = React.useState("");
  const [userNewConfirmPassword, setUserNewConfirmPassword] = React.useState("");
  const [showErrors, setShowErrors] = React.useState(false);

  const handleSubmit = () => {
    if (!userNewPassword || !userNewConfirmPassword) {
      setShowErrors(true);
      ToastAndroid.show("preencha os campos sua senha.", ToastAndroid.SHORT);
      return;
    }
    if (userNewPassword !== userNewConfirmPassword) {
      setShowErrors(true);
      ToastAndroid.show("As senhas não coincidem, preencha os campos igualmente", ToastAndroid.SHORT);
      return;
    }

    ToastAndroid.show("Link enviado para seu email.", ToastAndroid.SHORT);
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
                  label="Senha nova"
                  value={userNewPassword}
                  setValue={setUserNewPassword}
                  placeholder="Email ou telefone"
                  showError={showErrors && !userNewPassword}
                />
                <TextInput
                  label="Repita sua  senha"
                  value={userNewPassword}
                  setValue={setUserNewConfirmPassword}
                  placeholder="Senha"
                  type="password"
                  showError={showErrors && !userNewConfirmPassword}
                />
              </View>

              <DefaultButton btnText="Enviar" onPress={handleSubmit} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </FormScreenWrapper>
  );
}