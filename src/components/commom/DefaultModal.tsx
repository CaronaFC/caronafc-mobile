import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Layout, Modal, Spinner, } from '@ui-kitten/components';


type Props = {
    visible: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};

const DefaultModal = (props: Props) => {
    const { visible, onClose, children } = props;
    return (
        <Layout className='min-h-192' level="1">
            <Modal
                visible={visible}
                backdropStyle={styles.backdrop}
                onBackdropPress={onClose}
            >
                <Card disabled={true}>
                    <View className='items-center justify-center gap-y-4'>
                        {children}
                    </View>
                </Card>
            </Modal>
        </Layout>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default DefaultModal