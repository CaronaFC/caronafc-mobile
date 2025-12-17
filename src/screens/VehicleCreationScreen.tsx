import { View, Text, Platform, KeyboardAvoidingView, Alert, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import SelectInput, { Option } from "../components/commom/SelectInput";
import { useAuth } from "../context/AuthContext";
import { getVehiclesTypes, createVehicle } from "../services/vehicleService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";

import FipeSelect from "../components/fipe/FipeSelect";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";
import { ScrollView } from "react-native-gesture-handler";

type Props = {};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "VehicleCreation"
>;

const VehicleCreationScreen = (props: Props) => {
  const { refreshUserData } = useAuth();
  const [apiTypes, setApiTypes] = useState<any[]>([]);

  const [vehicleTypes, setVehicleTypes] = useState<Option[]>([]);

  const [selectedType, setSelectedTipoVeiculo] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedBrandName, setSelectedBrandName] = useState("");
  const [selectedModelName, setSelectedModelName] = useState("");
  const [selectedRenavam, setSelectedRenavam] = useState("");
  const [selectedPlate, setSelectedPlate] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { userData } = useAuth();

  const fields = [
    {
      label: "RENAVAM",
      value: selectedRenavam,
      setValue: (num: string) => {
        const limited = num.slice(0, 11);
        setSelectedRenavam(limited);
      },
      placeholder: "RENAVAM",
    },
    {
      label: "Placa",
      value: selectedPlate,
      setValue: (text: string) => {
        const upperClean = text.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
        setSelectedPlate(upperClean);
      },
      placeholder: "Placa",
    },
  ];

  const colors = [
    { label: "Selecione uma cor", value: "" },
    { label: "Preto", value: "Preto" },
    { label: "Branco", value: "Branco" },
    { label: "Prata", value: "Prata" },
    { label: "Cinza", value: "Cinza" },
    { label: "Vermelho", value: "Vermelho" },
    { label: "Azul", value: "Azul" },
    { label: "Verde", value: "Verde" },
    { label: "Amarelo", value: "Amarelo" },
    { label: "Marrom", value: "Marrom" },
    { label: "Rosa", value: "Rosa" },
    { label: "Laranja", value: "Laranja" },
    { label: "Bege", value: "Bege" },
  ];

  const handleSubmit = async () => {
    const selectedTypeId = apiTypes.find(
      (tipo) => tipo.descricao === selectedType
    );

    console.log("Submitting vehicle:", {
      tipoVeiculoId: selectedTypeId.id,
      marca: selectedBrand,
      modelo: selectedModel,
      renavam: selectedRenavam,
      placa: selectedPlate,
      cor: selectedColor,
      usuarioId: userData?.data?.id,
    });

    try {
      const response = await createVehicle({
        tipoVeiculoId: selectedTypeId.id,
        marca: selectedBrandName,
        modelo: selectedModelName,
        renavam: selectedRenavam,
        placa: selectedPlate,
        cor: selectedColor,
        usuarioId: userData?.data?.id ?? 0,
      });
      console.log("Vehicle created successfully:", response);
      refreshUserData();
      Alert.alert("veículo cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  async function loadTypes() {
    try {
      const types = await getVehiclesTypes();

      const typesOption: Option[] = types.map((tipo: any) => ({
        label: tipo.descricao,
        value: tipo.descricao,
      }));
      setApiTypes(types);
      setVehicleTypes([
        { label: "Selecione uma opção", value: "" },
        ...typesOption,
      ]);
    } catch (error) {
      console.log("Erro ao carregar tipos de veículos:", error);
    }
  }

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    setSelectedBrand("");
    setSelectedModel("");
  }, [selectedType]);

  const handleTipoChange = (newType: string) => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedTipoVeiculo(newType);
  };
  const insets = useSafeAreaInsets();
  return (
    <FormScreenWrapper>
      <LinearGradient
        colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Cadastrar Veículo</Text>
          <Text style={styles.subtitle}>Preencha os dados do seu veículo</Text>

          <View style={styles.formContainer}>
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
                  keyboardType={field.label == "RENAVAM" ? "numeric" : "default"}
                />
              </View>
            ))}
            <SelectInput
              label="Cor"
              selectedValue={selectedColor}
              onValueChange={setSelectedColor}
              options={colors}
            />
            <DefaultButton
              btnText="Cadastrar Veículo"
              style={styles.submitButton}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </LinearGradient>
    </FormScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 24,
  },
  formContainer: {
    gap: 16,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default VehicleCreationScreen;
