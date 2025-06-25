import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import DefaultButton from "../components/commom/DefaultButton";
import TextInput from "../components/commom/TextInput";
import { RootStackParamList } from "../navigation";
import { PrimaryModal } from "../components/commom/LoaderSpinner";
import { registerUser } from "../services/authService";

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
  const [showErrors, setShowErros] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const renderIcon = () => (
    <TouchableOpacity
      style={{
        width: 110,
        height: 105,
        backgroundColor: "#D9D9D9",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 55,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FontAwesome5 name="user-alt" size={20} color="#333" />
    </TouchableOpacity>
  );

  const handleSubmit = async () => {

    try {
      setIsLoading(true)

      if (!userName || !userPassword || !userCPF || !userEmail) {
        setShowErros(true)
        return;
      }

      const data = await registerUser({
        cpf: userCPF,
        email: userEmail,
        nome_completo: userName,
        senha: userPassword,
        numero: userPhone,
      })
      if (!data) {
        ToastAndroid.show("Erro ao realizar cadastro.", ToastAndroid.SHORT)
        return;
      }

      console.log("response:", data)
      ToastAndroid.show("Usuário cadastrado com sucesso", ToastAndroid.LONG)
      navigation.navigate("Login")
    } catch (error) {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }

  }

  const renderGoogleIcon = () => (
    <TouchableOpacity>
      <FontAwesome5 name="google-plus-g" fill="#000000" size={20} />
    </TouchableOpacity>
  );

  return (
    <View className="h-screen bg-primaryWhite">
      <View>
        <View style={{ marginBlock: 15 }} className="items-center ">
          {renderIcon()}
        </View>
        <Text className="text-primaryBlack text-md font-bold text-center ">
          Enviar Foto
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
            setValue={setUserEmail}
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
            setValue={setUserPhone}
            placeholder="Telefone"
          />
        </View>

        <DefaultButton
          btnText="Registrar"
          style={{ marginTop: 5 }}
          onPress={handleSubmit}
        />
        <DefaultButton
          leftIcon={renderGoogleIcon}
          btnText="Continue com o Google"
          btnColor="light"
        />
      </View>

      {isLoading && <PrimaryModal />}
    </View>
  );
}
