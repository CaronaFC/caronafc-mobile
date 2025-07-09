import { View, Text } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native";
import TextInput from '../components/commom/TextInput'
import DefaultButton from '../components/commom/DefaultButton'
import SelectInput, { Option } from '../components/commom/SelectInput'
import { useAuth } from "../context/AuthContext"
import { getVehiclesTypes, createVehicle } from '../services/vehicleService'

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

import FipeSelect from "../components/fipe/FipeSelect"
import FormScreenWrapper from '../components/commom/FormScreenWrapper';

type Props = {}

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login"
>;

const VehicleCreationScreen = (props: Props) => {
    const [apiTypes, setApiTypes] = useState<any[]>([])

    const [vehicleTypes, setVehicleTypes] = useState<Option[]>([])

    const [selectedType, setSelectedTipoVeiculo] = useState("")
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedModel, setSelectedModel] = useState('')
    const [selectedBrandName, setSelectedBrandName] = useState('');
    const [selectedModelName, setSelectedModelName] = useState('');
    const [selectedRenavam, setSelectedRenavam] = useState('')
    const [selectedPlate, setSelectedPlate] = useState('')
    const [selectedColor, setSelectedColor] = useState('')

    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { userData } = useAuth();

    const fields = [
        { label: "RENAVAM", value: selectedRenavam, setValue: setSelectedRenavam, placeholder: "RENAVAM" },
        { label: "Placa", value: selectedPlate, setValue: setSelectedPlate, placeholder: "Placa" },       
    ];

    const colors = [
        { label: 'Selecione uma cor', value: '' },
        { label: 'Preto', value: 'Preto' },
        { label: 'Branco', value: 'Branco' },
        { label: 'Prata', value: 'Prata' },
        { label: 'Cinza', value: 'Cinza' },
        { label: 'Vermelho', value: 'Vermelho' },
        { label: 'Azul', value: 'Azul' },
        { label: 'Verde', value: 'Verde' },
        { label: 'Amarelo', value: 'Amarelo' },
        { label: 'Marrom', value: 'Marrom' },
        { label: 'Rosa', value: 'Rosa' },
        { label: 'Laranja', value: 'Laranja' },
        { label: 'Bege', value: 'Bege' },
    ]

    const handleSubmit = async () => {
        const selectedTypeId = apiTypes.find(
            tipo => tipo.descricao === selectedType
        );

        console.log("Submitting vehicle:", {
            tipoVeiculoId: selectedTypeId.id,
            marca: selectedBrand,
            modelo: selectedModel,
            renavam: selectedRenavam,
            placa: selectedPlate,
            cor: selectedColor,
            usuarioId: userData?.data.id
        });

        try {
            const response = await createVehicle({
                tipoVeiculoId: selectedTypeId.id,
                marca: selectedBrandName,
                modelo: selectedModelName,
                renavam: selectedRenavam,
                placa: selectedPlate,
                cor: selectedColor,
                usuarioId: userData?.data.id ?? 0
            });
            console.log("Vehicle created successfully:", response);
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error creating vehicle:", error);
        }
    }


    async function loadTypes() {
        try {
            const types = await getVehiclesTypes();

            const typesOption: Option[] = types.map((tipo: any) => ({
                label: tipo.descricao,
                value: tipo.descricao,
            }));
            setApiTypes(types);
            setVehicleTypes([{ label: 'Selecione uma opção', value: '' }, ...typesOption]);
        } catch (error) {
            console.log('Erro ao carregar tipos de veículos:', error);
        }
    }

    useEffect(() => {
        loadTypes();
    }, []);

    useEffect(() => {
        setSelectedBrand('');
        setSelectedModel('');
    }, [selectedType]);

    const handleTipoChange = (newType: string) => {
        setSelectedBrand('');
        setSelectedModel('');
        setSelectedTipoVeiculo(newType);
    };

    return (
        <FormScreenWrapper>
            <View className="h-screen bg-primaryWhite">
                <View
                    style={{ gap: 10, flexDirection: "column" }}
                    className="p-4 gap-y-4 my-14"
                >
                    <SelectInput
                        label="Tipo de Veículo"
                        selectedValue={selectedType}
                        onValueChange={handleTipoChange}
                        options={vehicleTypes}
                    />
                    <FipeSelect
                        type="brand"
                        dependency={selectedType}
                        selectedValue={selectedBrand}
                        onValueChange={setSelectedBrand}
                        textSelect={setSelectedBrandName}

                    />
                    <FipeSelect
                        type="model"
                        dependency={selectedBrand}
                        vehicleType={selectedType}
                        selectedValue={selectedModel}
                        onValueChange={setSelectedModel}
                        textSelect={setSelectedModelName}
                    />
                    {fields.map((field, index) => (
                        <View key={index}>
                            <TextInput
                                label={field.label}
                                value={field.value}
                                setValue={field.setValue}
                                placeholder={field.placeholder}
                            />
                        </View>
                    ))}
                    <SelectInput
                        label="Cor"
                        selectedValue={selectedBrand}
                        onValueChange={setSelectedColor}
                        options={colors}
                    />
                    <DefaultButton
                        btnText="Cadastrar Veículo"
                        className='mt-5'
                        onPress={handleSubmit}
                    />
                </View>
            </View>
        </FormScreenWrapper>
    )
}

export default VehicleCreationScreen