import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";

import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import {
    ScrollView,
    View,
    Text,
    Pressable,
    RefreshControl,
} from "react-native";
import DefaultButton from "../components/commom/DefaultButton";

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

    const navigation = useNavigation<LoginScreenNavigationProp>();

    const { userData, userToken } = useAuth();

    const onRefresh = async () => {
        setRefreshing(true);

        await fetchUser();

        setRefreshing(false);
    };

    const filteredVehicles = vehicles.filter(
        (v) => v.tipoVeiculo.descricao === selectedType
    );

    const handleDeleteVehicle = async (vehicleId: number) => {
        try {
            await deleteVehicleId(vehicleId);
            console.log("Veículo deletado com sucesso:", vehicleId);
            setVehicles(vehicles.filter((v) => v.id !== vehicleId));
        } catch (error) {
            console.error("Erro ao deletar veículo:", error);
        }
    };

    async function fetchUser() {
        const response = await getUserById(
            Number(userData?.data.id),
            String(userToken)
        );
        console.log(response?.data.data.veiculos);
        setVehicles(response?.data.data.veiculos);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <ScrollView
            className="flex-1 bg-white px-4 pt-6"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <DefaultButton
                btnText={"Adicionar Veículo +"}
                btnColor="dark"
                style={{ flexGrow: 1 }}
                onPress={() => navigation.navigate("VehicleCreation")}
            />
            <View className="flex-row justify-between my-6">
                <DefaultButton
                    btnText={"Carros"}
                    btnColor="light"
                    style={{
                        minWidth: 180,
                        borderWidth: 2,
                        borderColor:
                            selectedType === "Carro" ? "#000" : "#d1d5db",
                    }}
                    onPress={() => setSelectedType("Carro")}
                />
                <DefaultButton
                    btnText={"Motos"}
                    btnColor="light"
                    style={{
                        minWidth: 180,
                        borderWidth: 2,
                        borderColor:
                            selectedType === "Moto" ? "#000" : "#d1d5db",
                    }}
                    onPress={() => setSelectedType("Moto")}
                />
            </View>

            {filteredVehicles.map((vehicle) => (
                <View
                    key={vehicle.id}
                    className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-300 gap-2"
                >
                    <View className="flex-row items-center gap-2 mb-1">
                        <FontAwesome5
                            name={
                                vehicle.tipoVeiculo.descricao === "Carro"
                                    ? "car"
                                    : "motorcycle"
                            }
                            size={20}
                            color="#1F2937"
                        />
                        <Text className="font-semibold text-gray-800">
                            {vehicle.modelo}
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-700">
                        Marca: {vehicle.marca}
                    </Text>
                    <Text className="text-sm text-gray-700">
                        Placa: {vehicle.placa}
                    </Text>
                    <Text className="text-sm text-gray-700">
                        RENAVAM: {vehicle.renavam}
                    </Text>
                    <Text className="text-sm text-gray-700">
                        Cor: {vehicle.cor}
                    </Text>
                    <Pressable
                        onPress={() => handleDeleteVehicle(vehicle.id)}
                        className="absolute right-4 bottom-4 bg-red-500 px-4 py-2 rounded-md flex-row items-center"
                    >
                        <Text className="text-white mr-1">Excluir</Text>
                        <EvilIcons name="trash" size={20} color="white" />
                    </Pressable>
                </View>
            ))}

            {filteredVehicles.length === 0 && (
                <Text className="text-center text-gray-500 mt-10">
                    Nenhum {selectedType.toLowerCase()} cadastrado.
                </Text>
            )}
        </ScrollView>
    );
}
