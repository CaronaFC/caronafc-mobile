import { useEffect, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    RefreshControl,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { createPayment } from "../services/paymentService";

export default function PaymentScreen() {
    const [payments, setPayments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { userData, userToken } = useAuth();
    const []

    const getPaymentById = async() => {
        
    }

    return (
        <View className="flex-1 p-4 bg-write">
            <Text className="text-lg font-semibold mb-4">Tela de Pagamento</Text>
            <View>
                <Image source={{uri: data:image/png;base64,${qr_code_base64}}}
            </View>
        </View>
    )
}
