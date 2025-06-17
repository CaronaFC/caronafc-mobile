import React from "react";

import { View, Text } from "react-native";
import SelectInput from "../components/commom/SelectInput";
import DefaultButton from "../components/commom/DefaultButton";

type Props = {};

export default function CreateTravelScreen({ }: Props) {


  const handleSubmit = () => { }

  const [origin, setOrigin] = React.useState("");
  const [game, setGame] = React.useState("");

  const origins = [
    { label: "Selecione uma origem", value: "" },
    { label: "São Paulo", value: "São Paulo" },
    { label: "Rio de Janeiro", value: "Rio de Janeiro" },
    { label: "Belo Horizonte", value: "Belo Horizonte" },
    { label: "Curitiba", value: "Curitiba" },
    { label: "Salvador", value: "Salvador" },
  ]

  const games = [
    { label: "Selecione um jogo", value: "" },
    { label: "Jogo 1", value: "Jogo 1" },
    { label: "Jogo 2", value: "Jogo 2" },
    { label: "Jogo 3", value: "Jogo 3" },
    { label: "Jogo 4", value: "Jogo 4" },
    { label: "Jogo 5", value: "Jogo 5" },
  ];


  return (
    <View className="h-screen bg-primaryWhite">
      <View
        style={{ gap: 10, flexDirection: "column" }}
        className="p-4 gap-y-4 my-14"
      >
        <SelectInput
          label="Origem"
          selectedValue={origin}
          onValueChange={setOrigin}
          options={origins}
        />

        <SelectInput
          label="Jogo"
          selectedValue={game}
          onValueChange={setGame}
          options={games}
        />

        <View className="flex-row gap-x-4">
          <SelectInput
            label="Vagas"
            selectedValue={game}
            onValueChange={setGame}
            options={games}
          />
          <SelectInput
            label="Vagas"
            selectedValue={game}
            onValueChange={setGame}
            options={games}
          />
        </View>


        <DefaultButton
          btnText="Cadastrar Viagem"
          className='mt-5'
          onPress={handleSubmit}
        />



      </View>
    </View>
  )
}
