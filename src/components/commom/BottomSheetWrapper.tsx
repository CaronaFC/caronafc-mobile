import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';

type BottomSheetWrapperProps = {
    children: React.ReactNode;
    snapPoint?: number;
    modalHeight?: number;
};

const BottomSheetWrapper = forwardRef<Modalize, BottomSheetWrapperProps>(
    ({ children, snapPoint = 300, modalHeight }, ref) => {
        return (
            <Modalize
                ref={ref}
                snapPoint={snapPoint}
                modalHeight={modalHeight || snapPoint}
            // adjustToContentHeight={false}
            >
                <View style={[styles.content, { height: modalHeight || snapPoint }]}>
                    {children}
                </View>
            </Modalize>
        );
    }
);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 10,
    },
});

export default BottomSheetWrapper;
