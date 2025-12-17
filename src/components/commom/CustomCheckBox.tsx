import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

type Props = {
    text: string;
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CustomCheckbox({ text, checked, setChecked }: Props) {
    return (
        <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={styles.container}
            activeOpacity={0.7}
        >
            {checked ? (
                <FontAwesome name="check-square" size={24} color="#00FF87" />
            ) : (
                <FontAwesome5 name="square" size={24} color="#666666" />
            )}
            <Text style={[styles.text, checked && styles.textChecked]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 8,
        color: '#AAAAAA',
        fontSize: 14,
    },
    textChecked: {
        color: '#FFFFFF',
    },
});
