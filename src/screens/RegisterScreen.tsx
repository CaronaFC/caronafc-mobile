import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DefaultButton from "src/components/commom/DefaultButton";
import TextInput from "src/components/commom/TextInput";
import { RootStackParamList } from "src/navigation";

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
		  	    label="Nome completo"
            value={userName}
            setValue={setUserName}
            placeholder="Nome completo"
          />
        </View>
        <View>
          <TextInput
		  	    label="Email"
            value={userEmail}
            setValue={setUserEmail}
            placeholder="Email"
          />
        </View>
        <View>
          <TextInput 
            label="CPF" 
            value={userCPF} 
            setValue={setUserCPF} 
            placeholder="CPF" 
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
        <View>
          <TextInput
		  	    label="Sua senha"
            value={userPassword}
            setValue={setUserPassword}
            placeholder="Senha"
            type="password"
          />
        </View>
        <DefaultButton
          btnText="Registrar"
          style={{ marginTop: 5 }}
          onPress={() => navigation.navigate("Home")}
        />
        <DefaultButton
          leftIcon={renderGoogleIcon}
          btnText="Continue com o Google"
          btnColor="light"
        />
      </View>
    </View>
  );
}
