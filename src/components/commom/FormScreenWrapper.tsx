import { View, Text, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React from 'react'
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { ScrollView } from 'react-native-gesture-handler';
type Props = {
    children: React.ReactNode
}

const FormScreenWrapper = ({ children }: Props) => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default FormScreenWrapper