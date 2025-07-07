import { View, Text, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
type Props = {
    children: React.ReactNode
}

const FormScreenWrapper = ({ children }: Props) => {
    return (

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default FormScreenWrapper