import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Layout, Modal, Spinner } from '@ui-kitten/components';

type Props = {
    message?: string;
};

export const LoaderSpinner = ({ message }: Props): React.ReactElement => {

    const [visible, setVisible] = React.useState(true);

    return (
        <Layout
            style={styles.container}
            level='1'
        >
            <Modal visible={visible} backdropStyle={styles.backdrop}>
                <Card disabled={true} style={styles.card}>
                    <View style={styles.content}>
                        <Spinner size='giant' status='success' />
                        {message && (
                            <Text style={styles.message}>{message}</Text>
                        )}
                    </View>
                </Card>
            </Modal>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 192,
        backgroundColor: 'transparent',
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderColor: '#2A2A2A',
        borderRadius: 16,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 16,
    },
    message: {
        color: '#FFFFFF',
        fontSize: 14,
    },
});
