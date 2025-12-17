import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DefaultButton from "../components/commom/DefaultButton";
import SelectInput, { Option } from "../components/commom/SelectInput";
import TextInput from "../components/commom/TextInput";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation";
import { createVehicle, getVehiclesTypes } from "../services/vehicleService";

import FormScreenWrapper from "../components/commom/FormScreenWrapper";
import FipeSelect from "../components/fipe/FipeSelect";

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
      setValue: (text: string) => {
        // Garante que text é uma string válida
        const safeText = text || "";
        // Remove todos os caracteres não numéricos e limita a 11 dígitos
        const numbersOnly = safeText.replace(/\D/g, "").slice(0, 11);
        setSelectedRenavam(numbersOnly);
      },
      placeholder: "12345678901",
    },
    {
      label: "Placa",
      value: selectedPlate,
      setValue: (text: string) => {
        try {
          // Garante que text é uma string válida
          const safeText = text || "";

          // Remove caracteres especiais e converte para maiúsculo
          const upperClean = safeText.toUpperCase().replace(/[^A-Z0-9]/g, "");

          // Limita a 7 caracteres e valida o padrão brasileiro
          let formatted = upperClean.slice(0, 7);

          // Validação do padrão brasileiro: ABC0A00 (Mercosul) ou ABC0000 (antigo)
          if (formatted.length >= 4) {
            const letters = formatted.slice(0, 3);
            const numbers = formatted.slice(3);

            // Garante que os 3 primeiros sejam letras
            const validLetters = letters.replace(/[^A-Z]/g, "");

            // Para o padrão Mercosul (ABC0A00), permite letra na 5ª posição
            let validNumbers = "";
            for (let i = 0; i < numbers.length; i++) {
              if (i === 1 && numbers.length >= 3) {
                // 5ª posição (índice 1 dos números) pode ser letra
                validNumbers += numbers[i].match(/[A-Z0-9]/) ? numbers[i] : "";
              } else {
                // Outras posições devem ser números
                validNumbers += numbers[i].match(/[0-9]/) ? numbers[i] : "";
              }
            }

            formatted = validLetters + validNumbers;
          }

          setSelectedPlate(formatted);
        } catch (error) {
          console.error("Erro ao formatar placa:", error);
          // Em caso de erro, define apenas os caracteres válidos
          const fallback = (text || "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 7);
          setSelectedPlate(fallback);
        }
      },
      placeholder: "ABC0A00 / ABC0000",
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
    // Validações básicas
    if (!selectedType) {
      Alert.alert("Erro", "Selecione o tipo de veículo.");
      return;
    }

    if (!selectedBrand || !selectedBrandName) {
      Alert.alert("Erro", "Selecione a marca do veículo.");
      return;
    }

    if (!selectedModel || !selectedModelName) {
      Alert.alert("Erro", "Selecione o modelo do veículo.");
      return;
    }

    if (!selectedRenavam) {
      Alert.alert("Erro", "Digite o RENAVAM do veículo.");
      return;
    }

    if (selectedRenavam.length !== 11) {
      Alert.alert("Erro", "RENAVAM deve conter exatamente 11 dígitos.");
      return;
    }

    if (!selectedPlate) {
      Alert.alert("Erro", "Digite a placa do veículo.");
      return;
    }

    if (selectedPlate.length !== 7) {
      Alert.alert("Erro", "A placa deve conter exatamente 7 caracteres.");
      return;
    }

    if (!selectedColor) {
      Alert.alert("Erro", "Selecione a cor do veículo.");
      return;
    }

    const selectedTypeId = apiTypes.find(
      (tipo) => tipo.descricao === selectedType
    );

    if (!selectedTypeId) {
      Alert.alert("Erro", "Tipo de veículo inválido.");
      return;
    }

    console.log("Submitting vehicle:", {
      tipoVeiculoId: selectedTypeId.id,
      marca: selectedBrandName,
      modelo: selectedModelName,
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
      Alert.alert("Sucesso", "Veículo cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating vehicle:", error);
      Alert.alert("Erro", "Falha ao cadastrar o veículo. Tente novamente.");
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
        colors={["#0D0D0D", "#1A1A1A", "#0D0D0D"]}
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
                  keyboardType={
                    field.label == "RENAVAM" ? "numeric" : "default"
                  }
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
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#AAAAAA",
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
