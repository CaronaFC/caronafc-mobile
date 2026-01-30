import { View, Text, ViewStyle, TextStyle, StyleSheet, Platform } from 'react-native'
import React, { useMemo } from 'react'
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
    // Ensure we always have at least one option to prevent Picker crash on Android
    const safeOptions = useMemo(() => {
        if (!options || options.length === 0) {
            return [{ label: "Carregando...", value: "" }];
        }
        return options;
    }, [options]);

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={[styles.picker, style]}
                    dropdownIconColor="#00FF87"
                    mode="dropdown"
                >
                    {safeOptions.map((option, index) => (
                        <Picker.Item
                            key={`${option.value}-${index}`}
                            label={option.label}
                            value={option.value}
                            style={styles.pickerItem}
                            color={Platform.OS === 'android' ? '#FFFFFF' : undefined}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        color: '#AAAAAA',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        overflow: 'hidden',
    },
    picker: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    pickerItem: {
        backgroundColor: '#1A1A1A',
        color: '#FFFFFF',
    },
});

export default SelectInput