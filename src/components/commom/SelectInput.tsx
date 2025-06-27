import { View, Text, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker';

export type Option = {
    label: string;
    value: string;
};

type StylePropType = ViewStyle | TextStyle;


type Props = {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: Option[];
    style?: StylePropType;

}
const SelectInput = ({ label, selectedValue, onValueChange, options, style }: Props) => {
    return (
        <View>
            <Text className="label-input mb-2">{label}</Text>
            <View className=" border rounded-md border-gray-200 bg-[#F2F3F3]">
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={style}

                >
                    {options.map((option, index) => (
                        <Picker.Item key={index} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default SelectInput