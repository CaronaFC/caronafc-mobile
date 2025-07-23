import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { LoaderSpinner } from "../components/commom/LoaderSpinner";
import { updateUser } from "../services/authService";

type UpdateProfileRouteProp = RouteProp<RootStackParamList, "UpdateProfile">;

export default function UpdateProfile() {
  const navigation = useNavigation();
  const route = useRoute<UpdateProfileRouteProp>();
  const { usuario } = route.params;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome_completo || "");
      setEmail(usuario.email || "");
      setTelefone(usuario.numero || "");
    }
  }, [usuario]);

  const handleSubmit = async () => {
    if (!nome || !email) {
      Alert.alert("Erro", "Nome e email são obrigatórios.");
      return;
    }

    setIsLoading(true);

    try {
      await updateUser({
        id: usuario.id,
        nome_completo: nome,
        email: email.trim().toLowerCase(),
        numero: telefone.trim(),
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      navigation.navigate('Profile'); // Redireciona para a tela de login após atualização
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormScreenWrapper>
      <View className="bg-white p-4">
        <Text className="text-xl font-bold text-center mb-4">
          Editar Perfil
        </Text>

        <TextInput
          label="Nome completo*"
          value={nome}
          setValue={setNome}
          placeholder="Digite seu nome"
        />

        <TextInput
          label="Email*"
          value={email}
          setValue={(text) => setEmail(text.trim().toLowerCase())}
          placeholder="Digite seu email"
        />

        <TextInput
          label="Telefone"
          value={telefone}
          setValue={(text) => setTelefone(text.trim())}
          placeholder="Digite seu telefone"
        />

        <DefaultButton
          btnText={isLoading ? "Salvando..." : "Salvar alterações"}
          style={{ marginTop: 20 }}
          onPress={handleSubmit}
        />

        {isLoading && <LoaderSpinner />}
      </View>
    </FormScreenWrapper>
  );
}
