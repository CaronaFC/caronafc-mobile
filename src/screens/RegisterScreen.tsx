import { FontAwesome5 } from "@expo/vector-icons";
import { Icon } from "@ui-kitten/components";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DefaultButton from "src/components/commom/DefaultButton";
import TextInput from "src/components/commom/TextInput";

type Props = {};

export default function RegisterScreen({}: Props) {
  const [userName, setUserName] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userCPF, setUserCPF] = React.useState("");
  const [userPhone, setUserPhone] = React.useState("");
  const [userDDD, setUserDDD] = React.useState("");

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
          <label className="label-input mb-2">Nome completo</label>
          <TextInput
            value={userName}
            setValue={setUserName}
            placeholder="Nome completo"
          />
        </View>
        <View>
          <label className="label-input mb-2">Email</label>
          <TextInput
            value={userEmail}
            setValue={setUserEmail}
            placeholder="Email"
          />
        </View>
        <View>
          <label className="label-input mb-2">CPF</label>
          <TextInput value={userCPF} setValue={setUserCPF} placeholder="CPF" />
        </View>
        <View>
          <Text className="label-input mb-2">Telefone</Text>
          <TextInput
            value={userPhone}
            setValue={setUserPhone}
            placeholder="Telefone"
          />
        </View>
        <View>
          <label className="label-input mb-2">Sua senha</label>
          <TextInput
            value={userPassword}
            setValue={setUserPassword}
            placeholder="Senha"
            type="password"
          />
        </View>
        <DefaultButton btnText="Registrar" style={{ marginTop: 5 }} />
        <DefaultButton
          leftIcon={renderGoogleIcon}
          btnText="Continue com o Google"
          btnColor="light"
        />
      </View>
      <View className="self-center w-36 h-2 bg-primaryBlack rounded-xl my-2" />
    </View>
  );
}
