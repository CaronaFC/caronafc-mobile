// src/components/travel/FiltersModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import PickerOption from "./PickerOption";
import { TeamType } from "../../types/teams";
import { Entypo } from "@expo/vector-icons";
import TimePickerInput from "../commom/TimePickerInput";

// Tipos
export interface FilterData {
  team: string;
  championship: string;
  date: Date | null;
  time: string;
  nearby: boolean;
}

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
  onClearFilters: () => void;
  initialFilters?: Partial<FilterData>;
  teams: TeamType[];
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
  teams,
}) => {
  // Estados dos filtros
  const [selectedTeam, setSelectedTeam] = useState<string>(
    initialFilters.team || ""
  );
  const [selectedChampionship, setSelectedChampionship] = useState<string>(
    initialFilters.championship || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialFilters.date ?? null
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    initialFilters.time || ""
  );
  const [nearbyOnly, setNearbyOnly] = useState<boolean>(
    initialFilters.nearby || false
  );

  const championships: string[] = ["Copa do Brasil", "Serie B", "Serie A"];

  const timeOptions: string[] = ["Manhã", "Tarde", "Noite"];

  // Handlers
  const handleApply = (): void => {
    const appliedFilters: FilterData = {
      team: selectedTeam,
      championship: selectedChampionship,
      date: selectedDate,
      time: selectedTime,
      nearby: nearbyOnly,
    };
    onApplyFilters(appliedFilters);
    onClose();
  };

  const handleClear = (): void => {
    setSelectedTeam("");
    setSelectedChampionship("");
    setSelectedDate(null);
    setSelectedTime("");
    setNearbyOnly(false);
    onClearFilters();
  };

  const handleTimeSelection = (period: string): void => {
    setSelectedTime(selectedTime === period ? "" : period);
  };

  const renderTimerPicker = () => (
    <TouchableOpacity>
      <Entypo name="calendar" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-gray-800">Filtros</Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Text className="text-gray-600 font-bold">✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conteúdo dos Filtros */}
        <ScrollView className="flex-1 p-4">
          <PickerOption
            label="Time"
            options={teams.map((t) => t.name)}
            value={selectedTeam}
            onValueChange={setSelectedTeam}
            placeholder="Todos os times"
          />

          <PickerOption
            label="Campeonato"
            options={championships}
            value={selectedChampionship}
            onValueChange={setSelectedChampionship}
            placeholder="Todos os campeonatos"
          />

          {/* Data */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Data</Text>
            <TimePickerInput
              value={selectedDate ?? new Date()}
              onChange={setSelectedDate}
              mode="date"
              accessoryLeft={renderTimerPicker}
            />
            <Text className="mt-2 text-gray-700">
              {selectedDate ? null : "Nenhuma data selecionada"}
            </Text>
          </View>

          {/* Horário */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Horário
            </Text>
            <View className="flex-row flex-wrap">
              {timeOptions.map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => handleTimeSelection(period)}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    selectedTime === period
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedTime === period
                        ? "text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mais próximos */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  Mostrar apenas caronas próximas
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Até 10km da sua localização
                </Text>
              </View>
              <Switch
                value={nearbyOnly}
                onValueChange={setNearbyOnly}
                trackColor={{ false: "#E5E7EB", true: "#DBEAFE" }}
                thumbColor={nearbyOnly ? "#3B82F6" : "#9CA3AF"}
              />
            </View>
          </View>
        </ScrollView>

        {/* Botões */}
        <View className="p-4 border-t border-gray-200 bg-gray-50">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleClear}
              className="flex-1 py-3 bg-gray-200 rounded-lg items-center"
            >
              <Text className="text-gray-700 font-medium">Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 py-3 bg-blue-600 rounded-lg items-center"
            >
              <Text className="text-white font-medium">Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FiltersModal;
