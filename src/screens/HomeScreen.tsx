import React, { useCallback, useEffect, useMemo, useState } from "react";

import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import DefaultButton from "../components/commom/DefaultButton";
import CardTravel from "../components/travel/CardTravel";
import FiltersModal, { FilterData } from "../components/travel/FiltersModal";
import { getTravels } from "../services/travelService";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { mapTravelToCardProps } from "../mappers/mapTravelToCardProps";
import { fetchAllTeams } from "../services/teamsService";
import { TeamType } from "../types/teams";
import { TravelAPIResponseType } from "../types/travel";
import { filterTravels } from "../lib/filterTravels";
import * as Location from "expo-location";

type Props = {};

export default function HomeScreen({}: Props) {
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
          const travels = (await getTravels()).sort((a, b) =>
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

  return (
    <View className="flex-1 bg-primaryWhite">
      <View className="p-4">
        {getActiveFiltersCount() > 0 && (
          <View className="bg-blue-50 p-3 rounded-lg mb-4 flex-row justify-between items-center">
            <Text className="text-blue-700 text-sm">
              {getActiveFiltersCount()} filtro(s) aplicado(s)
            </Text>
            <TouchableOpacity onPress={handleClearFilters}>
              <Text className="text-blue-600 text-sm font-medium">
                Limpar todos
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botões principais */}
        <View className="flex-row flex-wrap gap-2">
          <DefaultButton
            btnText={"Filtros"}
            btnColor="dark"
            style={{ flexGrow: 1 }}
            onPress={openFiltersModal}
          />
        </View>
      </View>

      {filteredTravels.length === 0 ? (
        <Text className="text-center my-auto text-xl">
          Nenhuma viagem disponível
        </Text>
      ) : (
        <FlatList
          data={filteredTravels}
          className="mb-2"
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <CardTravel {...mapTravelToCardProps(item)} />
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
