import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Layout, Modal, Spinner, } from '@ui-kitten/components';

export const PrimaryModal = (): React.ReactElement => {

    const [visible, setVisible] = React.useState(true);

    return (
        <Layout
            style={styles.container}
            level='1'
        >
            <Modal visible={visible} backdropStyle={styles.backdrop}
            >
                <Card disabled={true}>
                    <Spinner size='giant' />
                </Card>
            </Modal>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 192,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
