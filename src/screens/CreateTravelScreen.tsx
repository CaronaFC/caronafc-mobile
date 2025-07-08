import React, { useEffect, useMemo } from "react";

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
import { fetchAllMatches, fetchMatchById } from "../services/matchService";
import { geocodeAddress } from "../lib/location";
type Props = {};

export default function CreateTravelScreen({ }: Props) {



  const [matches, setMatches] = React.useState<any[]>([])
  const [game, setGame] = React.useState("");
  const [time, setTime] = React.useState(new Date());
  const [stadiumName, setStadiumName] = React.useState<string | null>(null);
  const [stadiumCoords, setStadiumCoords] = React.useState<CoordsPoint | null>(null);
  const [space, setSpace] = React.useState("");
  const [valuePerPerson, setValuePerPerson] = React.useState("");
  const [location, setLocation] = React.useState<LocationObjectCoords | null>(null);
  const [starterPoint, setStarterPoint] = React.useState<CoordsAddress | null>(null);
  const bottomSheetRef = React.useRef<Modalize>(null);

  useEffect(() => {
    async function fetchJogos() {
      try {
        const jogos = await fetchAllMatches();
        setMatches(jogos);
      } catch (error) {
        console.error(error);
      }
    }
    fetchJogos();
  }, []);

  useEffect(() => {

    async function fetchGameDetails() {
      if (game) {
        try {
          const match = await fetchMatchById(game);
          console.log("Detalhes do jogo:", match);
          if (match?.stadium?.name) {
            setStadiumName(match.stadium.name);
            const coords: CoordsPoint | null = await geocodeAddress(match.stadium.name);
            setStadiumCoords(coords);
            if (coords) {
              console.log("Coordenadas do estádio:", coords);
            }
          } else {
            setStadiumName("Estádio não informado");
          }

        } catch (error) {
          console.error("Erro ao buscar detalhes do jogo:", error);
        }
      } else {
        setStadiumName(null);
        setStadiumCoords(null);
      }
    }
    fetchGameDetails();
  }, [game]);


  const gamesOptions = React.useMemo(() => {

    function getTimestamp(jogo: any) {
      const [day, month, year] = jogo.date.split('/').map(Number);
      const [hour, minute] = jogo.time.split(':').map(Number);
      return new Date(year, month - 1, day, hour, minute).getTime();
    }

    const sorted = [...matches].sort((a, b) => getTimestamp(a) - getTimestamp(b));
    const options = [
      { label: "Selecione um jogo", value: "" },
      ...sorted.map(jogo => ({
        label: `${jogo.teams.home.name} x ${jogo.teams.away.name} - ${jogo.date}`,
        value: String(jogo.id),
      })),
    ];
    return options;
  }, [matches]);

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
          className="p-4 gap-y-4 "
        >
          <View className=" justify-between items-center gap-y-2">
            <TextInput
              value={""}
              setValue={() => { }}
              label="Origem"
              placeholder={starterPoint ? starterPoint.address : "Selecione seu ponto de partida no mapa"}
              disabled={true}
            />
            {stadiumName && (
              <TextInput
                value={stadiumName}
                setValue={setStadiumName}
                label="Destino (Estádio)"
                placeholder="Selecione o estádio"
                disabled={true}
              />
            )}

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
            options={gamesOptions}
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
          destinationCoords={stadiumCoords || null} // Passando as coordenadas do estádio
        />
      </BottomSheetWrapper>

    </FormScreenWrapper >
  )
}
