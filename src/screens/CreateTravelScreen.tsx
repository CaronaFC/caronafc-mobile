import React, { useMemo } from "react";

import { View, TouchableOpacity, Text } from "react-native";
import SelectInput from "../components/commom/SelectInput";
import DefaultButton from "../components/commom/DefaultButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TimePickerInput from "../components/commom/TimePickerInput";
import TextInput from "../components/commom/TextInput";
import CustomCheckbox from "../components/commom/CustomCheckBox";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";
import { LocationObjectCoords } from "expo-location";
import MapCreateTravel from "../components/travel/MapCreateTravel";
import BottomSheetWrapper from "../components/commom/BottomSheetWrapper";
import { Modalize } from "react-native-modalize";
import { CoordsAddress, CoordsPoint } from "../types/coords";
type Props = {};

export default function CreateTravelScreen({ }: Props) {



  const [origin, setOrigin] = React.useState("");
  const [game, setGame] = React.useState("");
  const [time, setTime] = React.useState(new Date());
  const [space, setSpace] = React.useState("");
  const [checked, setChecked] = React.useState(false)
  const [valuePerPerson, setValuePerPerson] = React.useState("");
  const [location, setLocation] = React.useState<LocationObjectCoords | null>(null);
  const [starterPoint, setStarterPoint] = React.useState<CoordsAddress | null>(null);
  const bottomSheetRef = React.useRef<Modalize>(null);

  const games = [
    { label: "Selecione um jogo", value: "" },
    { label: "Jogo 1", value: "Jogo 1" },
    { label: "Jogo 2", value: "Jogo 2" },
    { label: "Jogo 3", value: "Jogo 3" },
    { label: "Jogo 4", value: "Jogo 4" },
    { label: "Jogo 5", value: "Jogo 5" },
  ];

  const spaces = [
    { label: "Quantidade de Vagas", value: "" },
    { label: "1 vaga", value: "1" },
    { label: "2 vagas", value: "2" },
    { label: "3 vagas", value: "3" },
    { label: "4 vagas", value: "4" },
    { label: "5 vagas", value: "5" },
  ];

  const renderTimerPicker = () => (
    <TouchableOpacity>
      <MaterialCommunityIcons name="timer-outline" size={32} color="black" />
    </TouchableOpacity>
  );

  const handleSubmit = () => { }

  return (
    <FormScreenWrapper>
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <View
          style={{ gap: 10, flexDirection: "column" }}
          className="p-4 gap-y-4 my-14"
        >
          <View className=" justify-between items-center gap-y-2">

            <TextInput
              value={""}
              setValue={() => { }}
              label="Origem"
              placeholder={starterPoint ? starterPoint.address : "Selecione seu ponto de partida"}
              disabled={true}
            />

            <DefaultButton
              btnText="Abrir Mapa"
              className='w-full'
              onPress={() => bottomSheetRef.current?.open()}
            />
          </View>

          <SelectInput
            label="Jogo"
            selectedValue={game}
            onValueChange={setGame}
            options={games}
          />
          <SelectInput
            label="Vagas"
            selectedValue={space}
            onValueChange={setSpace}
            options={spaces}
          />

          <View className="flex-row justify-between items-center">
            <View>

              <TextInput
                value={valuePerPerson}
                setValue={setValuePerPerson}
                label="Valor por pessoa"
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            <View className="my-auto mt-10">
              <CustomCheckbox text="A viagem terá retorno?" />
            </View>
          </View>
          <View className="flex-row items-center ">
            <View className="flex-row ">
              <TimePickerInput
                label="Horário da partida"
                value={time}
                onChange={setTime}
                accessoryLeft={renderTimerPicker}
                styles={{ height: 55, width: "100%" }}
              />
            </View>

          </View>

          <DefaultButton
            btnText="Cadastrar Viagem"
            className='mt-10'
            onPress={handleSubmit}
          />
        </View>


      </View>
      <BottomSheetWrapper
        ref={bottomSheetRef}
        snapPoint={300}
        modalHeight={650}
      >
        <MapCreateTravel
          location={location}
          setLocation={setLocation}
          starterPoint={starterPoint}
          setStarterPoint={setStarterPoint}
        />
      </BottomSheetWrapper>

    </FormScreenWrapper >
  )
}
