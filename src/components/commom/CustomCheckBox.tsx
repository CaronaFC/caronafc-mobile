import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
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
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
            {checked ? (
                <FontAwesome name="check-square" size={24} color="black" />
            ) : (
                <FontAwesome5 name="square" size={24} color="black" />
            )}
            <Text style={{ marginLeft: 8 }}>{text}</Text>
        </TouchableOpacity>
    );
}
