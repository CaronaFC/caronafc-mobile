import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Card, Layout, Modal, Spinner, } from '@ui-kitten/components';
import { View } from 'react-native';
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
            <Modal visible={visible} backdropStyle={styles.backdrop}
            >
                <Card disabled={true}>
                    <View className='items-center justify-center gap-y-4'>

                        <Spinner size='giant' />
                        {message && (
                            <Text>{message}</Text>
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
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
