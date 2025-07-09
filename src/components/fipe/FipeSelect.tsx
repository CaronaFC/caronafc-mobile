import { useEffect, useState } from "react";
import SelectInput, { Option } from "../../components/commom/SelectInput";
import { getFipeBrands, getFipeModels } from "../../services/fipeService";

const fipePathMap: Record<string, string> = {
  Carro: "carros",
  Moto: "motos",
  Caminhão: "caminhoes",
};

type Props = {
  type: "brand" | "model";
  dependency: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  vehicleType?: string;
  textSelect: (value: string) => void;
};

function FipeSelect({
  type,
  dependency,
  selectedValue,
  onValueChange,
  vehicleType,
  textSelect,
}: Props) {
  const [options, setOptions] = useState<Option[]>([]);

  async function loadOptions() {
    try {
      if (type === "brand") {
        const fipePath = fipePathMap[dependency];
        const brands = await getFipeBrands(fipePath);
        const formatted = brands.map((b: any) => ({
          label: b.nome,
          value: b.codigo,          
        }));
        const getNameSelect = brands.find((b: any) => b.codigo === selectedValue);
        console.log("getNameSelect", getNameSelect);
        setOptions([{ label: "Selecione uma marca", value: "" }, ...formatted]);
      }

      if (type === "model" && vehicleType) {
        const fipePath = fipePathMap[vehicleType];
        const models = await getFipeModels(fipePath, dependency);
        const formatted = models.map((m: any) => ({
          label: m.nome,
          value: m.codigo,
        }));
        setOptions([{ label: "Selecione um modelo", value: "" }, ...formatted]);
      }
    } catch (error) {
      console.error(`Erro ao carregar ${type}s FIPE:`, error);
    }
  }

  useEffect(() => {
    if (type === "brand" && (!dependency || dependency === "")) {
      setOptions([{ label: "Selecione um tipo antes", value: "" }]);
      onValueChange("");
      return;
    }

    if (
      type === "model" &&
      (!vehicleType || !dependency || dependency === "")
    ) {
      setOptions([{ label: "Selecione uma marca antes", value: "" }]);
      onValueChange("");
      return;
    }
    loadOptions();
  }, [dependency, type, vehicleType]);

  return (
    <SelectInput
      label={type === "brand" ? "Marca do Veículo" : "Modelo do Veículo"}
      selectedValue={selectedValue}
      onValueChange={(value) => {
        onValueChange(value);
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption) {
          textSelect(selectedOption.label);
        }
      }}
      options={options}
    />
  );
}

export default FipeSelect;
