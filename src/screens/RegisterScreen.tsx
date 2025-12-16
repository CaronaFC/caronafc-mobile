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

export default function RegisterScreen({}: Props) {
  const [userName, setUserName] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userCPF, setUserCPF] = React.useState("");
  const [userPhone, setUserPhone] = React.useState("");
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [showErrors, setShowErros] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!userName || !userPassword || !userCPF || !userEmail) {
        setShowErros(true);
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
    } catch (error) {
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
      <View className="h-screen bg-primaryWhite">
        <View>
          <View style={{ marginBlock: 15 }} className="items-center ">
            <TouchableOpacity
              onPress={handlePickImage}
              style={{
                width: 110,
                height: 105,
                backgroundColor: "#D9D9D9",
                borderWidth: 1,
                borderColor: "gray",
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
                <FontAwesome5 name="user-alt" size={20} color="#333" />
              )}
            </TouchableOpacity>
          </View>
          {userImage && (
            <TouchableOpacity
              style={{ alignSelf: "center"}}
              onPress={() => setUserImage(null)}
              className="bg-neutral-200 px-3 py-1 rounded-lg mb-2"
            >
              <Text className="font-bold text-red-700">Remover imagem</Text>
            </TouchableOpacity>
          )}
          <Text className="text-primaryBlack text-md font-bold text-center ">
            Selecão de foto
          </Text>
        </View>
        <View style={{ gap: 10, flexDirection: "column" }} className="p-4">
          <View>
            <TextInput
              label="Nome completo*"
              value={userName}
              setValue={setUserName}
              placeholder="Nome completo"
              showError={showErrors && !userName}
            />
          </View>
          <View>
            <TextInput
              label="Sua senha*"
              value={userPassword}
              setValue={setUserPassword}
              placeholder="Senha"
              type="password"
              showError={showErrors && !userPassword}
            />
          </View>
          <View>
            <TextInput
              label="Email*"
              value={userEmail}
              setValue={(text) => setUserEmail(text.trim().toLowerCase())}
              placeholder="Email"
              showError={showErrors && !userName}
            />
          </View>
          <View>
            <TextInput
              label="CPF*"
              value={userCPF}
              setValue={setUserCPF}
              placeholder="CPF"
              showError={showErrors && !userName}
            />
          </View>
          <View>
            <TextInput
              label="Telefone"
              value={userPhone}
              setValue={(text)=>setUserPhone(text.trim())}
              placeholder="Telefone"
            />
          </View>

          <DefaultButton
            btnText="Registrar"
            style={{ marginTop: 5 }}
            onPress={handleSubmit}
          />
        </View>

        {isLoading && <LoaderSpinner />}
      </View>
    </FormScreenWrapper>
  );
}
