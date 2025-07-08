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

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

export default function ForgotPassword() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = React.useState("");
  const [showErrors, setShowErrors] = React.useState(false);

  const handleSubmit = () => {
    if (!email) {
      setShowErrors(true);
      ToastAndroid.show("Informe seu email.", ToastAndroid.SHORT);
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

              <TextInput
                label="Email"
                value={email}
                setValue={setEmail}
                placeholder="Digite seu email"
                showError={showErrors && !email}
              />

              <DefaultButton btnText="Enviar" onPress={handleSubmit} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </FormScreenWrapper>
  );
}