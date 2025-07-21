import { View, Text, Platform, StyleProp, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@ui-kitten/components';

type Props = {
    label: string;
    value: Date;
    onChange: (value: Date) => void;
    accessoryLeft?: () => React.ReactElement;
    styles?: StyleProp<ViewStyle>;
    disabled?: boolean;

};
const TimePickerInput = ({ label, value, onChange, accessoryLeft, styles, disabled }: Props) => {

    const [show, setShow] = useState(false);

    const handleChange = (_event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || value;
        setShow(Platform.OS === 'ios');
        onChange(currentDate);
    };

    return (
        <View style={styles}>
            <Text className="label-input mb-2">{label}</Text>
            <Button
                onPress={() => setShow(true)}
                appearance="ghost"
                style={{ borderWidth: 0, backgroundColor: "#F2F3F3" }}
                accessoryLeft={accessoryLeft}
                className="flex-row items-center justify-center"
                disabled={disabled}
            >
                <View className="flex-row items-center">
                    <Text style={{ color: "black" }}>
                        {value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                </View>
            </Button>
            {show && (
                <RNDateTimePicker
                    value={value}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleChange}
                    
                />
            )}
        </View>
    );
}

export default TimePickerInput