import { FontAwesome5 } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import DefaultButton from "../components/commom/DefaultButton";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";
import { LoaderSpinner } from "../components/commom/LoaderSpinner";
import TextInput from "../components/commom/TextInput";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation";
import { updateUser } from "../services/authService";

type UpdateUserRouteProp  = RouteProp<RootStackParamList, "UpdateUser">;

export default function UpdateUserScreen() {
  const {refreshUserData } = useAuth()
  const navigation = useNavigation();
  const route = useRoute<UpdateUserRouteProp>();
  const usuario = route.params?.usuario;

  console.log("Usuario recebido:", usuario); // Debug

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome_completo || "");
      setEmail(usuario.email || "");
      setTelefone(usuario.numero || "");
      setUserImage(usuario.imagem || null);
    }
  }, [usuario]);

  const handleSubmit = async () => {
    if (!nome || !email) {
      Alert.alert("Erro", "Nome e email são obrigatórios.");
      return;
    }

    if (!usuario?.id) {
      Alert.alert("Erro", "Usuário não encontrado.");
      return;
    }

    setIsLoading(true);

    const updateData: any = {
      id: usuario.id,
      nome_completo: nome,
      email: email.trim().toLowerCase(),
      numero: telefone.trim(),
    };

    // Só adiciona a imagem se houver uma
    if (userImage) {
      updateData.imagem = userImage;
    }

    console.log("Dados a serem enviados:", updateData);
    console.log("ID do usuário:", usuario.id);

    try {
      await updateUser(updateData);
      console.log("Perfil atualizado com sucesso", usuario);
      refreshUserData();

      Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      console.error("Status do erro:", error.response?.status);
      console.error("Dados do erro:", error.response?.data);
      console.error("Headers do erro:", error.response?.headers);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.response?.status === 401) {
        Alert.alert("Erro de Autenticação", "Sua sessão expirou. Faça login novamente.");
      } else if (error.response?.status === 500) {
        Alert.alert("Erro do Servidor", "Houve um problema no servidor. Tente novamente em alguns instantes.");
      } else if (error.response?.status === 413) {
        Alert.alert("Erro", "A imagem é muito grande. Tente uma imagem menor.");
      } else {
        Alert.alert("Erro", error.message || "Falha ao atualizar perfil.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permissão necessária", "Precisamos de permissão para acessar suas fotos.");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];

        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 300 } }],
          {
            compress: 0.1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        if (manipResult.base64) {
          // Verificar se a imagem não é muito grande
          const imageSizeKB = (manipResult.base64.length * 3) / 4 / 1024;
          console.log(`Tamanho da imagem: ${imageSizeKB.toFixed(2)} KB`);
          
          if (imageSizeKB > 1000) { // Limitar a 1MB
            Alert.alert("Erro", "A imagem é muito grande. Tente uma imagem menor.");
            return;
          }
          
          setUserImage(`data:image/jpeg;base64,${manipResult.base64}`);
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar/comprimir imagem:", error);
      Alert.alert("Erro ao selecionar/comprimir imagem.");
    }
  };

  return (
    <FormScreenWrapper>
      <View className="bg-white p-4">
        <Text className="text-xl font-bold text-center mb-4">
          Editar Perfil
        </Text>

        {/* Avatar Section */}
        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={handlePickImage}
            className="w-28 h-28 bg-gray-100 border-2 border-green-500 rounded-full items-center justify-center overflow-hidden"
          >
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <FontAwesome5 name="user-alt" size={32} color="#10B981" />
            )}
          </TouchableOpacity>
          {userImage ? (
            <TouchableOpacity
              className="mt-2"
              onPress={() => setUserImage(null)}
            >
              <Text className="text-red-500 font-semibold">Remover foto</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-500 text-xs mt-2">
              Toque para adicionar foto
            </Text>
          )}
        </View>

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

