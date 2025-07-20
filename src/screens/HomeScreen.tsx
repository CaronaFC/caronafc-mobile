import React, { useCallback, useState } from "react";

import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import DefaultButton from "../components/commom/DefaultButton";
import CardTravel from "../components/travel/CardTravel";
import FiltersModal, { FilterData } from "../components/travel/FiltersModal";
import { getTravels } from "../services/travelService";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

type Props = {};

export default function HomeScreen({ }: Props) {
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterData>({
    team: "",
    stadium: "",
    championship: "",
    date: "",
    time: "",
    nearby: false,
  });
  const [travels, setTravels] = useState<any>([])

  useFocusEffect(
    useCallback(() => {
      const fetchTravels = async () => {
        try {
          const travels = await getTravels();
          setTravels(travels);
        } catch {
          Alert.alert('Erro ao buscar viagens');
        }
      };
  
      fetchTravels();
    }, [])
  );
  

  const getActiveFiltersCount = (): number => {
    return Object.values(appliedFilters).filter(
      (value) => value && value !== "" && value !== false
    ).length;
  };

  const handleApplyFilters = (newFilters: FilterData): void => {
    setAppliedFilters(newFilters);
    console.log("Filtros aplicados:", newFilters);
  };

  const handleClearFilters = (): void => {
    setAppliedFilters({
      team: "",
      stadium: "",
      championship: "",
      date: "",
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

    {
      travels.length === 0 ? (
        <Text className="text-center my-auto text-xl">Nenhuma viagem disponível</Text>
      ) : (
        <FlatList
          data={travels}
          className="mb-2"
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: { item: any }) => (
            <CardTravel
              id={item.id}
              horario={item.horario}
              valorPorPessoa={item.valorPorPessoa}
              origemLat={item.origem_lat}
              origemLong={item.origem_long}
              temRetorno={item.temRetorno}
              qtdVagas={item.qtdVagas}
              motorista={{
                nome: item.motorista.nome_completo,
                id: item.motorista.id
              }}
              jogo={{
                id: item.jogo.id,
                estadio: item.jogo.nomeEstadio,
                timeCasa: item.jogo.timeCasa,
                timeFora: item.jogo.timeFora,
                dataJogo: item.jogo.dataJogo
              }}
          />
          )}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )
    }
    

      {/* Modal de Filtros */}
      <FiltersModal
        visible={showFiltersModal}
        onClose={closeFiltersModal}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        initialFilters={appliedFilters}
      />
    </View>
  );
}
