import React, { useEffect, useMemo, useState } from "react";
import { Alert, View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { LocationObjectCoords } from "expo-location";
import { useAuth } from "../context/AuthContext";

import SelectInput from "../components/commom/SelectInput";
import DefaultButton from "../components/commom/DefaultButton";
import TimePickerInput from "../components/commom/TimePickerInput";
import TextInput from "../components/commom/TextInput";
import CustomCheckbox from "../components/commom/CustomCheckBox";
import FormScreenWrapper from "../components/commom/FormScreenWrapper";
import MapCreateTravel from "../components/travel/MapCreateTravel";
import BottomSheetWrapper from "../components/commom/BottomSheetWrapper";

import { CoordsAddress, CoordsPoint } from "../types/coords";
import { fetchAllMatches, fetchMatchById } from "../services/matchService";
import { geocodeAddress } from "../lib/location";
import { createTravel } from "../services/travelService";
import { CreateTravelType } from "../types/travel";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";

type CreateTravelScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function CreateTravelScreen() {
  const { userData } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [game, setGame] = useState("");
  const [time, setTime] = useState(new Date());
  const [stadiumName, setStadiumName] = useState<string | null>(null);
  const [stadiumCoords, setStadiumCoords] = useState<CoordsPoint | null>(null);
  const [space, setSpace] = useState("");
  const [valuePerPerson, setValuePerPerson] = useState("");
  const [hasReturn, setHasReturn] = useState(false);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [starterPoint, setStarterPoint] = useState<CoordsAddress | null>(null);
  const bottomSheetRef = React.useRef<Modalize>(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<CreateTravelScreenProps>();
  

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
          if (match?.stadium?.name) {
            setStadiumName(match.stadium.name);
            const coords: CoordsPoint | null = await geocodeAddress(match.stadium.name);
            setStadiumCoords(coords);
          } else {
            setStadiumName("Estádio não informado");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setStadiumName(null);
        setStadiumCoords(null);
      }
    }
    fetchGameDetails();
  }, [game]);

  const gamesOptions = useMemo(() => {
    function getTimestamp(jogo: any) {
      const [day, month, year] = jogo.date.split('/').map(Number);
      const [hour, minute] = jogo.time.split(':').map(Number);
      return new Date(year, month - 1, day, hour, minute).getTime();
    }

    const sorted = [...matches].sort((a, b) => getTimestamp(a) - getTimestamp(b));
    return [
      { label: "Selecione um jogo", value: "" },
      ...sorted.map(jogo => ({
        label: `${jogo.teams.home.name} x ${jogo.teams.away.name} - ${jogo.date}`,
        value: String(jogo.id),
      })),
    ];
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

  const handleSubmit = async () => {
    if (!userData || !starterPoint || !location || !game || !space || !valuePerPerson) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const dto: CreateTravelType = {
        motoristaId: userData.data.id,
        jogo: { id: Number(game) },
        origem_lat: starterPoint.latitude,
        origem_long: starterPoint.longitude,
        horario: time.toISOString(),
        qtdVagas: Number(space),
        temRetorno: hasReturn,
        valorPorPessoa: parseFloat(valuePerPerson),
      };
      await createTravel(dto);
      Alert.alert("Sucesso", "Viagem criada com sucesso!");
      navigation.navigate("Home");

    } catch (error: any) {
      Alert.alert("Erro", 'message' in error ? error.message : "Erro ao criar viagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreenWrapper>
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <View style={{ gap: 10, flexDirection: "column" }} className="p-4 gap-y-4">
          <View className="justify-between items-center gap-y-2">
            <TextInput
              value={starterPoint?.address || ""}
              setValue={() => { }}
              label="Origem"
              placeholder="Selecione seu ponto de partida no mapa"
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
            <TextInput
              value={valuePerPerson}
              setValue={setValuePerPerson}
              label="Valor por pessoa"
              placeholder="0.00"
              keyboardType="numeric"
            />
            <View className="my-auto mt-10">
              <CustomCheckbox
                text="A viagem terá retorno?"
                checked={hasReturn}
                setChecked={setHasReturn}
              />
            </View>
          </View>

          <View className="flex-row items-center">
            <TimePickerInput
              label="Horário da partida"
              value={time}
              onChange={setTime}
              accessoryLeft={renderTimerPicker}
              styles={{ height: 55, width: "100%" }}
            />
          </View>

          <DefaultButton
            btnText={loading ? "Cadastrando..." : "Cadastrar Viagem"}
            className='mt-10'
            onPress={handleSubmit}
            disabled={loading}
          />
        </View>
      </View>

      <BottomSheetWrapper ref={bottomSheetRef} snapPoint={300} modalHeight={650}>
        <MapCreateTravel
          location={location}
          setLocation={setLocation}
          starterPoint={starterPoint}
          setStarterPoint={setStarterPoint}
          destinationCoords={stadiumCoords || null}
        />
      </BottomSheetWrapper>
    </FormScreenWrapper>
  );
}
