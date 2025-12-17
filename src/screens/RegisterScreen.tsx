import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Text, TouchableOpacity, View, Image } from "react-native";
import DefaultButton from "../components/commom/DefaultButton";
import TextInput from "../components/commom/TextInput";
import { RootStackParamList } from "../navigation";
import { LoaderSpinner } from "../components/commom/LoaderSpinner";
import { registerUser } from "../services/authService";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

type Props = {};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen({ }: Props) {
  const [userName, setUserName] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userCPF, setUserCPF] = React.useState("");
  const [userPhone, setUserPhone] = React.useState("");
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [showErrors, setShowErros] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [emailError, setEmailError] = React.useState(false);


  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!userName || !userPassword || !userCPF || !userEmail) {
        setShowErros(true);
        return;
      }

      if (!isValidEmail(userEmail)) {
        setEmailError(true);
        return;
      }

      const data = await registerUser({
        cpf: userCPF,
        email: userEmail,
        nome_completo: userName,
        senha: userPassword,
        numero: userPhone,
        imagem: userImage || undefined,
      });
      if (!data) {
        Alert.alert("Erro ao realizar cadastro.");
        return;
      }

      console.log("response:", data);
      Alert.alert("Usuário cadastrado com sucesso");
      navigation.navigate("Login");
    } catch (error:any) {
      Alert.alert("Erro ao cadastrar",error.message)
      setIsLoading(false);
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];

        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 500 } }],
          {
            compress: 0.3,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        if (manipResult.base64) {
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
      <View className="h-screen bg-dark-900">
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ color: '#00FF87', fontSize: 24, fontWeight: 'bold' }}>
            Criar Conta
          </Text>
          <Text style={{ color: '#888888', fontSize: 14, marginTop: 4 }}>
            Preencha seus dados para começar
          </Text>
        </View>

        {/* Avatar Section */}
        <View style={{ marginVertical: 20 }} className="items-center">
          <TouchableOpacity
            onPress={handlePickImage}
            style={{
              width: 110,
              height: 110,
              backgroundColor: "#1A1A1A",
              borderWidth: 3,
              borderColor: "#00FF87",
              borderRadius: 55,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <FontAwesome5 name="user-alt" size={32} color="#00FF87" />
            )}
          </TouchableOpacity>
          {userImage ? (
            <TouchableOpacity
              style={{ marginTop: 8 }}
              onPress={() => setUserImage(null)}
            >
              <Text style={{ color: '#FF4444', fontWeight: '600' }}>Remover foto</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#888888', fontSize: 12, marginTop: 8 }}>
              Toque para adicionar foto
            </Text>
          )}
        </View>

        {/* Form */}
        <View style={{ gap: 12, paddingHorizontal: 16 }}>
          <TextInput
            label="Nome completo*"
            value={userName}
            setValue={setUserName}
            placeholder="Digite seu nome completo"
            showError={showErrors && !userName}
          />
          <TextInput
            label="Senha*"
            value={userPassword}
            setValue={setUserPassword}
            placeholder="Crie uma senha segura"
            type="password"
            showError={showErrors && !userPassword}
          />
          <TextInput
            label="Email*"
            value={userEmail}
            setValue={(text) => {
              const email = text.trim().toLowerCase();
              setUserEmail(email);
              setEmailError(email.length > 0 && !isValidEmail(email));
            }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            showError={emailError}
            errorMessage="Formato de e-mail inválido"
          />

          <TextInput
            label="CPF*"
            value={userCPF}
            setValue={setUserCPF}
            placeholder="000.000.000-00"
            mask="999.999.999-99"
            keyboardType="numeric"
            showError={showErrors && !userCPF}
          />
          <TextInput
            label="Telefone"
            value={userPhone}
            setValue={(text) => setUserPhone(text.trim())}
            placeholder="(00) 00000-0000"
            mask="(99) 99999-9999"
            keyboardType="numeric"
          />

          <View style={{ marginTop: 8 }}>
            <DefaultButton
              btnText={isLoading ? "Criando conta..." : "Criar Conta"}
              btnColor="primary"
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#888888' }}>
              Já tem uma conta? <Text style={{ color: '#00FF87', fontWeight: '600' }}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && <LoaderSpinner />}
      </View>
    </FormScreenWrapper>
  );
}
