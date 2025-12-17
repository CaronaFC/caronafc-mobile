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
      <Entypo name="calendar" size={24} color="#00FF87" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
        {/* Header */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' }}>
          <View className="flex-row justify-between items-center">
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#00FF87' }}>Filtros</Text>
            <TouchableOpacity
              onPress={onClose}
              style={{ padding: 8, backgroundColor: '#1A1A1A', borderRadius: 20 }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conteúdo dos Filtros */}
        <ScrollView style={{ flex: 1, padding: 16 }}>
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
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#AAAAAA', marginBottom: 8 }}>Data</Text>
            <TimePickerInput
              value={selectedDate ?? new Date()}
              onChange={setSelectedDate}
              mode="date"
              accessoryLeft={renderTimerPicker}
            />
            <Text style={{ marginTop: 8, color: '#666666' }}>
              {selectedDate ? null : "Nenhuma data selecionada"}
            </Text>
          </View>

          {/* Horário */}
          <View style={{ marginBottom: 16, marginTop: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#AAAAAA', marginBottom: 8 }}>
              Horário
            </Text>
            <View className="flex-row flex-wrap">
              {timeOptions.map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => handleTimeSelection(period)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: selectedTime === period ? 'rgba(0, 255, 135, 0.2)' : '#1A1A1A',
                    borderWidth: 1,
                    borderColor: selectedTime === period ? '#00FF87' : '#2A2A2A',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: selectedTime === period ? '#00FF87' : '#AAAAAA',
                    }}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mais próximos */}
          <View style={{ marginBottom: 24 }}>
            <View className="flex-row justify-between items-center">
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#FFFFFF' }}>
                  Mostrar apenas caronas próximas
                </Text>
                <Text style={{ fontSize: 12, color: '#666666', marginTop: 4 }}>
                  Até 10km da sua localização
                </Text>
              </View>
              <Switch
                value={nearbyOnly}
                onValueChange={setNearbyOnly}
                trackColor={{ false: "#2A2A2A", true: "rgba(0, 255, 135, 0.3)" }}
                thumbColor={nearbyOnly ? "#00FF87" : "#666666"}
              />
            </View>
          </View>
        </ScrollView>

        {/* Botões */}
        <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#2A2A2A', backgroundColor: '#1A1A1A' }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={handleClear}
              style={{ flex: 1, paddingVertical: 14, backgroundColor: '#262626', borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#AAAAAA', fontWeight: '600' }}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              style={{ flex: 1, paddingVertical: 14, backgroundColor: '#00FF87', borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#0D0D0D', fontWeight: '700' }}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FiltersModal;
