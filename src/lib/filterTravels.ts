import { FilterData } from "../components/travel/FiltersModal";
import { TravelAPIResponseType } from "../types/travel";
import { calculateDistance } from "./location";

const NEARBY_MAX_DISTANCE_IN_KM = 10;

export const filterTravels = (
  travels: TravelAPIResponseType[],
  filters: FilterData,
  userLocation: any
): TravelAPIResponseType[] => {
  return travels.filter((travel) => {
    const jogo = travel.jogo;

    if (filters.team) {
      const teamName = filters.team.toLowerCase();
      if (
        !jogo.timeCasa.nome.toLowerCase().includes(teamName) &&
        !jogo.timeFora.nome.toLowerCase().includes(teamName)
      ) {
        return false;
      }
    }

    if (filters.championship) {
      console.log(jogo);
      if (
        !jogo.liga.nome
          .toLowerCase()
          .includes(filters.championship.toLowerCase())
      ) {
        return false;
      }
    }

    if (filters.date) {
      const travelDate = travel.jogo.data;
      const selectedDateStr = filters.date.toLocaleDateString("pt-BR");
      if (travelDate !== selectedDateStr) return false;
    }

    if (filters.time) {
      const [hourStr] = jogo.horario.split(":");
      const hour = parseInt(hourStr, 10);
      if (filters.time === "Manhã" && (hour < 6 || hour >= 12)) return false;
      if (filters.time === "Tarde" && (hour < 12 || hour >= 18)) return false;
      if (filters.time === "Noite" && (hour < 18 || hour >= 24)) return false;
    }

    if (filters.nearby) {
      if (!userLocation) return false;
      const distance = calculateDistance(
        travel.origem_lat,
        travel.origem_long,
        userLocation.latitude,
        userLocation.longitude
      );
      if (distance > NEARBY_MAX_DISTANCE_IN_KM) return false;
    }

    return true;
  });
};
