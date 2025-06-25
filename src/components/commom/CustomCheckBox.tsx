import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

type Props = {
    text: string
};

export default function CustomCheckbox({ text }: Props) {
    const [checked, setChecked] = useState(false);

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
