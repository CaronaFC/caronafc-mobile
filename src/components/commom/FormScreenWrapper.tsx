import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React from "react";
type Props = {
  children: React.ReactNode;
};

const FormScreenWrapper = ({ children }: Props) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: '#0D0D0D' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 5 }}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: '#0D0D0D' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: '#0D0D0D' }}>{children}</View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormScreenWrapper;
