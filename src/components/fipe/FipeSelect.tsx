import { useEffect, useState, useCallback } from "react";
import SelectInput, { Option } from "../../components/commom/SelectInput";
import { getFipeBrands, getFipeModels } from "../../services/fipeService";

const fipePathMap: Record<string, string> = {
  Carro: "cars",
  Moto: "motorcycles",
  Caminhão: "trucks",
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
  // Initialize with a default option to prevent empty Picker crash
  const defaultOption: Option = type === "brand"
    ? { label: "Selecione um tipo antes", value: "" }
    : { label: "Selecione uma marca antes", value: "" };

  const [options, setOptions] = useState<Option[]>([defaultOption]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = useCallback(async () => {
    setIsLoading(true);
    try {
      if (type === "brand") {
        const fipePath = fipePathMap[dependency];
        if (!fipePath) {
          setIsLoading(false);
          return;
        }
        const brands = await getFipeBrands(fipePath);
        if (brands && Array.isArray(brands)) {
          const formatted = brands.map((b: any) => ({
            label: b.name || "Sem nome",
            value: String(b.code || ""),
          }));
          setOptions([{ label: "Selecione uma marca", value: "" }, ...formatted]);
        }
      }

      if (type === "model" && vehicleType) {
        const fipePath = fipePathMap[vehicleType];
        if (!fipePath) {
          setIsLoading(false);
          return;
        }
        const models = await getFipeModels(fipePath, dependency);
        if (models && Array.isArray(models)) {
          const formatted = models.map((m: any) => ({
            label: m.name || "Sem nome",
            value: String(m.code || ""),
          }));
          setOptions([{ label: "Selecione um modelo", value: "" }, ...formatted]);
        }
      }
    } catch (error) {
      setOptions([{ label: `Erro ao carregar ${type === "brand" ? "marcas" : "modelos"}`, value: "" }]);
    } finally {
      setIsLoading(false);
    }
  }, [type, dependency, vehicleType]);

  useEffect(() => {
    if (type === "brand" && (!dependency || dependency === "")) {
      setOptions([{ label: "Selecione um tipo antes", value: "" }]);
      return;
    }

    if (
      type === "model" &&
      (!vehicleType || !dependency || dependency === "")
    ) {
      setOptions([{ label: "Selecione uma marca antes", value: "" }]);
      return;
    }

    // Set loading state before fetching
    setOptions([{ label: "Carregando...", value: "" }]);
    loadOptions();
  }, [dependency, type, vehicleType, loadOptions]);

  const handleValueChange = useCallback((value: string) => {
    onValueChange(value);
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption && selectedOption.value !== "") {
      textSelect(selectedOption.label);
    }
  }, [options, onValueChange, textSelect]);

  return (
    <SelectInput
      label={type === "brand" ? "Marca do Veículo" : "Modelo do Veículo"}
      selectedValue={selectedValue}
      onValueChange={handleValueChange}
      options={options}
    />
  );
}

export default FipeSelect;
