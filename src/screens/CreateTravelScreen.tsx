import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getUserVehicle } from "../services/userService";
import { Game } from "../types/game";
import { mapRawGameToGameProps } from "../mappers/mapTravelToCardProps";

type CreateTravelScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "CreateTravel"
>;

export default function CreateTravelScreen() {
  const { userData } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [gameId, setGameId] = useState<number | null>(null);
  const [match, setMatch] = useState<Game | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [stadiumName, setStadiumName] = useState<string | null>(null);
  const [stadiumCoords, setStadiumCoords] = useState<CoordsPoint | null>(null);
  const [space, setSpace] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [valuePerPerson, setValuePerPerson] = useState("");
  const [hasReturn, setHasReturn] = useState(false);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [starterPoint, setStarterPoint] = useState<CoordsAddress | null>(null);
  const bottomSheetRef = React.useRef<Modalize>(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<CreateTravelScreenProps>();

  useFocusEffect(
    useCallback(() => {
      const checkVehicles = async () => {
        try {
          if (!userData?.data?.id) {
            Alert.alert("Atenção!", "Usuário não autenticado.");
            return;
          }

          const vehicles = await getUserVehicle(userData?.data?.id);

          if (!vehicles || vehicles.length === 0) {
            Alert.alert(
              "Atenção!",
              "Para criar viagens você precisa ter algum veículo cadastrado.",
              [
                { text: "OK", onPress: () => navigation.goBack() },
                {
                  text: "Criar Veículo",
                  onPress: () => navigation.navigate("VehicleCreation"),
                },
              ],
              { cancelable: false }
            );
          }
        } catch (err) {
          // Silent fail - user can continue without vehicle check
        }
      };

      checkVehicles();
    }, [userData, navigation])
  );

  useEffect(() => {
    async function fetchJogos() {
      try {
        const jogos = await fetchAllMatches();
        setMatches(jogos);
      } catch (error) {
        // Silent fail - empty matches list
      }
    }
    fetchJogos();
  }, []);

  useEffect(() => {
    async function fetchGameDetails() {
      if (gameId) {
        try {
          const fetchedMatch = await fetchMatchById(gameId);
          setMatch(mapRawGameToGameProps(fetchedMatch));

          if (fetchedMatch?.stadium?.name) {
            setStadiumName(fetchedMatch.stadium.name);
            const coords = await geocodeAddress(fetchedMatch.stadium.name);
            setStadiumCoords(coords);
          } else {
            setStadiumName("Estádio não informado");
            setStadiumCoords(null);
          }

          if (fetchedMatch.date) {
            const [day, month, year] = fetchedMatch.date.split("/").map(Number);
            const [hour, minute] = fetchedMatch.time.split(":").map(Number);
            const gameDate = new Date(year, month - 1, day, hour, minute);
            setTime(gameDate);
          } else {
            setTime(null);
          }
        } catch (error) {
          // Silent fail - match details not loaded
        }
      } else {
        setMatch(null);
        setStadiumName(null);
        setStadiumCoords(null);
        setTime(null);
      }
    }
    fetchGameDetails();
  }, [gameId]);

  const gamesOptions = useMemo(() => {
    function getTimestamp(jogo: any) {
      const [day, month, year] = jogo.date.split("/").map(Number);
      const [hour, minute] = jogo.time.split(":").map(Number);
      return new Date(year, month - 1, day, hour, minute).getTime();
    }

    const sorted = [...matches].sort(
      (a, b) => getTimestamp(a) - getTimestamp(b)
    );
    return [
      { label: "Selecione um jogo", value: "" },
      ...sorted.map((jogo) => ({
        label: `${jogo.teams.home.name} x ${jogo.teams.away.name} - ${jogo.date}`,
        value: String(jogo.id),
      })),
    ];
  }, [matches]);

  const vehicleOptions = useMemo(() => {
    if (!userData?.data?.veiculos)
      return [{ label: "Nenhum veículo encontrado", value: "" }];

    return [
      { label: "Selecione um veículo", value: "" },
      ...userData.data.veiculos.map((veiculo: any) => ({
        label: `${veiculo.marca} ${veiculo.modelo} - ${veiculo.cor}`,
        value: veiculo.id,
      })),
    ];
  }, [userData?.data?.veiculos]);

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
      <MaterialCommunityIcons name="timer-outline" size={32} color="#00FF87" />
    </TouchableOpacity>
  );

  const handleSubmit = async () => {
    if (
      !userData ||
      !starterPoint ||
      !location ||
      !gameId ||
      !space ||
      !valuePerPerson ||
      !vehicle ||
      !time
    ) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const dto: CreateTravelType = {
        motoristaId: userData.data.id,
        jogo: match!,
        origem_lat: starterPoint.latitude,
        origem_long: starterPoint.longitude,
        destino_lat: stadiumCoords?.latitude || 0,
        destino_long: stadiumCoords?.longitude || 0,
        horario: time.toISOString(),
        qtdVagas: Number(space),
        temRetorno: hasReturn,
        valorPorPessoa: parseFloat(valuePerPerson),
        veiculoId: Number(vehicle),
      };

      await createTravel(dto);
      resetForm();
      Alert.alert("Sucesso", "Viagem criada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        "message" in error ? error.message : "Erro ao criar viagem."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGameId(null);
    setMatch(null);
    setTime(null);
    setStadiumName(null);
    setStadiumCoords(null);
    setSpace("");
    setVehicle("");
    setValuePerPerson("");
    setHasReturn(false);
    setLocation(null);
    setStarterPoint(null);
  };
  return (
    <FormScreenWrapper>
      <View style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
        <View className="p-4 gap-y-4">
          {/* Header */}
          <View className="mb-2">
            <Text style={{ color: '#00FF87', fontSize: 24, fontWeight: 'bold' }}>
              Criar Viagem
            </Text>
            <Text style={{ color: '#888888', fontSize: 14, marginTop: 4 }}>
              Preencha os dados para oferecer uma carona
            </Text>
          </View>

          {/* Location Section */}
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
            <TextInput
              value={starterPoint?.address || ""}
              setValue={() => {}}
              label="Local de Partida"
              placeholder="Selecione no mapa"
              disabled={true}
            />
            {stadiumName && (
              <View style={{ marginTop: 12 }}>
                <TextInput
                  value={stadiumName}
                  setValue={setStadiumName}
                  label="Destino (Estádio)"
                  placeholder="Selecione o estádio"
                  disabled={true}
                />
              </View>
            )}
            <View style={{ marginTop: 12 }}>
              <DefaultButton
                btnText="Abrir Mapa"
                btnColor="secondary"
                onPress={() => bottomSheetRef.current?.open()}
              />
            </View>
          </View>

          {/* Game Selection */}
          <SelectInput
            label="Selecione o Jogo"
            selectedValue={gameId !== null ? gameId.toString() : ""}
            onValueChange={(value) => {
              if (value === "") {
                setGameId(null);
              } else {
                setGameId(Number(value));
              }
            }}
            options={gamesOptions}
          />

          {/* Vehicle and Spaces Row */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <SelectInput
                label="Vagas"
                selectedValue={space}
                onValueChange={setSpace}
                options={spaces}
              />
            </View>
            {userData?.data?.veiculos && (
              <View style={{ flex: 1 }}>
                <SelectInput
                  label="Veículo"
                  selectedValue={vehicle}
                  onValueChange={setVehicle}
                  options={vehicleOptions}
                />
              </View>
            )}
          </View>

          {/* Price and Return */}
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                value={valuePerPerson}
                setValue={setValuePerPerson}
                label="Valor por pessoa"
                placeholder="R$ 0,00"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, paddingBottom: 8 }}>
              <CustomCheckbox
                text="Com retorno?"
                checked={hasReturn}
                setChecked={setHasReturn}
              />
            </View>
          </View>

          {/* Time Picker */}
          <TimePickerInput
            label="Horário de Saída"
            value={time ?? new Date()}
            onChange={setTime}
            accessoryLeft={renderTimerPicker}
            styles={{ height: 55, width: "100%" }}
            disabled={!time}
          />

          {/* Submit Button */}
          <View style={{ marginTop: 8 }}>
            <DefaultButton
              btnText={loading ? "Criando viagem..." : "Criar Viagem"}
              btnColor="primary"
              onPress={handleSubmit}
              disabled={loading}
            />
          </View>
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
          destinationCoords={stadiumCoords || null}
        />
      </BottomSheetWrapper>
    </FormScreenWrapper>
  );
}
