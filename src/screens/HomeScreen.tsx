import React, { useCallback, useEffect, useMemo, useState } from "react";

import { View, Text, TouchableOpacity, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import DefaultButton from "../components/commom/DefaultButton";
import CardTravel from "../components/travel/CardTravel";
import FiltersModal, { FilterData } from "../components/travel/FiltersModal";
import { getTravels } from "../services/travelService";
import { useFocusEffect } from "@react-navigation/native";
import { mapTravelToCardProps } from "../mappers/mapTravelToCardProps";
import { fetchAllTeams } from "../services/teamsService";
import { TeamType } from "../types/teams";
import { TravelAPIResponseType } from "../types/travel";
import { filterTravels } from "../lib/filterTravels";
import * as Location from "expo-location";
import { openRequest } from "../services/requestsService";
import { useAuth } from "../context/AuthContext";

type Props = {};

export default function HomeScreen({}: Props) {
  const { userData } = useAuth();
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterData>({
    team: "",
    championship: "",
    date: null,
    time: "",
    nearby: false,
  });
  const [travels, setTravels] = useState<TravelAPIResponseType[]>([]);
  const [teams, setTeams] = useState<TeamType[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchTravels = async () => {
        try {
          const travels = (await getTravels({
            status: 'espera',
          })).sort((a, b) =>
            a.jogo.estadio.nome.localeCompare(b.jogo.estadio.nome)
          );
          if (travels.length === 0) return;

          setTravels(travels);
        } catch {
          Alert.alert("Erro ao buscar viagens");
        }
      };

      const fetchTeams = async () => {
        try {
          const teams = (await fetchAllTeams()).sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setTeams(teams);
        } catch {
          Alert.alert("Erro ao buscar times");
        }
      };

      fetchTravels();
      fetchTeams();
    }, [])
  );

  const getActiveFiltersCount = (): number => {
    return Object.values(appliedFilters).filter(
      (value) => value && value !== "" && value !== false
    ).length;
  };

  const handleApplyFilters = async (newFilters: FilterData): Promise<void> => {
    setAppliedFilters(newFilters);
    if (newFilters.nearby) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão negada para acessar localização");
        closeFiltersModal();
      }
      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);
    } else {
      setUserLocation(null);
    }
    console.log("Filtros aplicados:", newFilters);
  };

  const filteredTravels = useMemo(() => {
    return filterTravels(travels, appliedFilters, userLocation);
  }, [travels, appliedFilters, userLocation]);

  const handleClearFilters = (): void => {
    setAppliedFilters({
      team: "",
      championship: "",
      date: null,
      time: "",
      nearby: false,
    });
    console.log("Filtros limpos");
  };

  const openFiltersModal = (): void => {
    setShowFiltersModal(true);
  };

  const closeFiltersModal = (): void => {
    setShowFiltersModal(false);
  };

  const handleRequest = async (vehicleId: number) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja enviar um pedido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            try {
              const data = await openRequest(vehicleId);

              if (data.status === 201) {
                Alert.alert("Pedido enviado com sucesso!");
              }
            } catch (error: any) {
              Alert.alert(error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-1 bg-dark-900">
      <View className="p-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-accent-primary text-2xl font-bold">
            Viagens Disponíveis
          </Text>
          <Text className="text-text-muted text-sm mt-1">
            Encontre sua carona para o próximo jogo
          </Text>
        </View>

        {getActiveFiltersCount() > 0 && (
          <View className="bg-accent-primary/10 p-3 rounded-xl mb-4 flex-row justify-between items-center border border-accent-primary/30">
            <Text className="text-accent-primary text-sm font-medium">
              {getActiveFiltersCount()} filtro(s) aplicado(s)
            </Text>
            <TouchableOpacity onPress={handleClearFilters}>
              <Text className="text-accent-muted text-sm font-bold">
                Limpar todos
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botões principais */}
        <View className="flex-row flex-wrap gap-2">
          <DefaultButton
            btnText={"Filtros"}
            btnColor="secondary"
            style={{ flexGrow: 1 }}
            onPress={openFiltersModal}
          />
        </View>
      </View>

      {filteredTravels.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-accent-primary text-5xl mb-4">⚽</Text>
          <Text className="text-text-primary text-xl font-bold text-center">
            Nenhuma viagem disponível
          </Text>
          <Text className="text-text-muted text-center mt-2">
            Não encontramos viagens no momento. Tente aplicar outros filtros ou volte mais tarde.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTravels}
          className="mb-2"
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <CardTravel
              {...mapTravelToCardProps(item)}
              id={item.id}
              handleRequest={handleRequest}
              currentUserId={userData?.data?.id}
            />
          )}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Filtros */}
      <FiltersModal
        visible={showFiltersModal}
        onClose={closeFiltersModal}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        initialFilters={appliedFilters}
        teams={teams}
      />
    </View>
  );
}
