import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import TextInput from "../components/commom/TextInput";
import DefaultButton from "../components/commom/DefaultButton";
import { LoaderSpinner } from "../components/commom/LoaderSpinner";
import { updateUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type UpdateUserRouteProp = RouteProp<RootStackParamList, "UpdateUser">;

export default function UpdateUserScreen() {
  const { refreshUserData, userData: currentUserData } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<UpdateUserRouteProp>();
  const usuario = route.params?.usuario;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome_completo || "");
      setEmail(usuario.email || "");
      setTelefone(usuario.numero || "");
    }
    // Also try to get image from current user data
    if (currentUserData?.data?.imagem) {
      setImagem(currentUserData.data.imagem);
    }
  }, [usuario, currentUserData]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permissão negada", "É necessário permitir acesso à galeria para alterar a foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      // Store as base64 or URI depending on your API
      const imageUri = result.assets[0].uri;
      setImagem(imageUri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permissão negada", "É necessário permitir acesso à câmera para tirar foto.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImagem(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Alterar foto",
      "Escolha uma opção",
      [
        { text: "Tirar foto", onPress: takePhoto },
        { text: "Escolher da galeria", onPress: pickImage },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

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

    try {
      const updateData: any = {
        id: usuario.id,
        nome_completo: nome,
        email: email.trim().toLowerCase(),
        numero: telefone.trim(),
      };

      // Only include image if it was changed
      if (imagem && imagem !== currentUserData?.data?.imagem) {
        updateData.imagem = imagem;
      }

      await updateUser(updateData);
      refreshUserData();

      Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Image Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={showImageOptions} style={styles.imageContainer}>
              {imagem ? (
                <Image source={{ uri: imagem }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <FontAwesome5 name="user-alt" size={40} color="#00FF87" />
                </View>
              )}
              <View style={styles.editBadge}>
                <FontAwesome5 name="camera" size={14} color="#0D0D0D" />
              </View>
            </TouchableOpacity>
            <Text style={styles.changePhotoText}>Toque para alterar a foto</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                label="Nome completo *"
                value={nome}
                setValue={setNome}
                placeholder="Digite seu nome"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Email *"
                value={email}
                setValue={(text) => setEmail(text.trim().toLowerCase())}
                placeholder="Digite seu email"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Telefone"
                value={telefone}
                setValue={(text) => setTelefone(text.trim())}
                placeholder="Digite seu telefone"
              />
            </View>

            <DefaultButton
              btnText={isLoading ? "Salvando..." : "Salvar alterações"}
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </View>

          {isLoading && <LoaderSpinner />}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#00FF87',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00FF87',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00FF87',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0D0D0D',
  },
  changePhotoText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 12,
  },
  formSection: {
    gap: 16,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
  },
});

