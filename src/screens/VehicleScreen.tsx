import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";

import { ScrollView, View, Text, Pressable } from "react-native";
import DefaultButton from "../components/commom/DefaultButton";

import { getUserById } from "../services/userService"
import { deleteVehicleId} from "../services/vehicleService";
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
  "Login"
>;

export default function VehicleScreen() {
    const [selectedType, setSelectedType] = useState<"Carro" | "Moto">("Carro");
		const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const navigation = useNavigation<LoginScreenNavigationProp>();

    const { userData, userToken } = useAuth();

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
		}

		useEffect(() => {
			async function fetchUser() {
				const response = await getUserById(Number(userData?.data.id), String(userToken));	
				console.log(response?.data.data.veiculos);
				setVehicles(response?.data.data.veiculos);		
			}

			fetchUser();
		}, [])

    return (
        <ScrollView className="flex-1 bg-white px-4 pt-6">
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
                        borderColor: selectedType === "Carro" ? "#000" : "#d1d5db",
                    }}
                    onPress={() => setSelectedType("Carro")}
                />     
                <DefaultButton
                    btnText={"Motos"}
                    btnColor="light"
                    style={{
                        minWidth: 180,
                        borderWidth: 2,
                        borderColor: selectedType === "Moto" ? "#000" : "#d1d5db",
                    }}
                    onPress={() => setSelectedType("Moto")}
                />     
            </View>
        
            {filteredVehicles.map((vehicle) => (
                <View
                key={vehicle.id}
                className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-300"
                >
                    <Text className="font-semibold text-gray-800 mb-1">
                        {vehicle.modelo} 
                    </Text>                   
                    <Text className="text-sm text-gray-700 mb-1">Marca: {vehicle.marca}</Text>
                    <Text className="text-sm text-gray-700 mb-1">Placa: {vehicle.placa}</Text>
                    <Text className="text-sm text-gray-700 mb-1">Cor: {vehicle.cor}</Text>
                    <Text className="text-sm text-gray-700">RENAVAM: {vehicle.renavam}</Text>								
										<Pressable
												onPress={() => handleDeleteVehicle(vehicle.id)}
												className="absolute right-4 top-4 bg-red-500 px-4 py-2 rounded-md"
										>
												<Text className="text-white">Excluir</Text>
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
