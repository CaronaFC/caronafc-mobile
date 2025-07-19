import { useEffect, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    RefreshControl,
    TouchableOpacity,
    Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { FontAwesome5 } from "@expo/vector-icons";

import { getUserById } from "../services/userService";
import { deleteVehicleId } from "../services/vehicleService";
import { useAuth } from "../context/AuthContext";

type Vehicle = {
    id: number;
    placa: string;
    renavam: string;
    marca: string;
    modelo: string;
    cor: string;
    tipoVeiculo: {
        id: number;
        descricao: string;
    };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Vehicle"
>;

export default function VehicleScreen() {
    const [selectedType, setSelectedType] = useState<"Carro" | "Moto">("Carro");
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [openMenuForId, setOpenMenuForId] = useState<number | null>(null);
    const [menuOpen, setMenuOpen] = useState<Boolean>(false);

    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { userData, userToken } = useAuth();

    const open = (boolean: Boolean) => {
        setMenuOpen(boolean);
        setOpenMenuForId(null);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUser();
        setRefreshing(false);
    };

    const fetchUser = async () => {
        const response = await getUserById(
            Number(userData?.data.id),
            String(userToken)
        );
        setVehicles(response?.data.data.veiculos);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleDelete = async (vehicleId: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza que deseja excluir este veículo?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteVehicleId(vehicleId);
                            setVehicles((prev) =>
                                prev.filter((v) => v.id !== vehicleId)
                            );
                            setOpenMenuForId(null);
                        } catch (error) {
                            console.error("Erro ao deletar:", error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleEdit = (vehicleId: number) => {
        setOpenMenuForId(null);
        // navigation.navigate("VehicleEdit", { id: vehicleId });
    };

    return (
        <View className="flex-1 bg-white relative">          
            <ScrollView
                className="px-4"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <TouchableOpacity></TouchableOpacity>
                {vehicles.map((vehicle) => (
                    <View
                        key={vehicle.id}
                        className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-300 relative mt-4"
                    >
                        <View className="flex-row items-center mb-1 gap-2">
                            <FontAwesome5
                                name={
                                    vehicle.tipoVeiculo.descricao === "Carro"
                                        ? "car"
                                        : "motorcycle"
                                }
                                size={20}
                                color="#1F2937"
                            />
                            <Text className="font-semibold text-xl text-gray-800 max-w-[80%]">
                                {vehicle.modelo}
                            </Text>
                        </View>

                        <Text className="text-gray-700">
                            Marca: {vehicle.marca}
                        </Text>
                        <Text className="text-gray-700">
                            Placa: {vehicle.placa}
                        </Text>
                        <Text className="text-gray-700">
                            RENAVAM: {vehicle.renavam}
                        </Text>
                        <Text className="text-gray-700">
                            Cor: {vehicle.cor}
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                const isOpen = openMenuForId === vehicle.id;
                                setOpenMenuForId(isOpen ? null : vehicle.id);
                                setMenuOpen(!isOpen);
                            }}
                            className="absolute right-4 top-4 bg-gray-300 px-4 py-2 rounded-md z-10"
                        >
                            <Text className="text-black text-lg font-bold">
                                ...
                            </Text>
                        </TouchableOpacity>

                        {openMenuForId === vehicle.id && (
                            <View className="absolute right-4 top-16 bg-white rounded-md border border-gray-300 shadow-lg w-32 z-20">
                                <TouchableOpacity
                                    onPress={() => handleEdit(vehicle.id)}
                                    className="px-4 py-3 border-b border-gray-200"
                                >
                                    <Text className="text-gray-800 text-center">
                                        Editar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDelete(vehicle.id)}
                                    className="px-4 py-3"
                                >
                                    <Text className="text-red-600 text-center font-semibold">
                                        Excluir
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}

                {vehicles.length === 0 && (
                    <Text className="text-center text-gray-500 mt-10">
                        Nenhum {selectedType.toLowerCase()} cadastrado.
                    </Text>
                )}
            </ScrollView>
        </View>
    );
}
