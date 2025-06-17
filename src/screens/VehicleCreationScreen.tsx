import { View, Text } from 'react-native'
import React from 'react'
import TextInput from '../components/commom/TextInput'
import DefaultButton from '../components/commom/DefaultButton'
import SelectInput from '../components/commom/SelectInput'

type Props = {}

const VehicleCreationScreen = (props: Props) => {
    const [vehicleBrand, setVehicleBrand] = React.useState('')
    const [vehicleModel, setVehicleModel] = React.useState('')
    const [vehicleRenavam, setVehicleRenavam] = React.useState('')
    const [vehiclePlate, setVehiclePlate] = React.useState('')
    const [vehicleColor, setVehicleColor] = React.useState('')

    const fields = [
        { label: "Modelo", value: vehicleModel, setValue: setVehicleModel, placeholder: "Modelo" },
        { label: "RENAVAM", value: vehicleRenavam, setValue: setVehicleRenavam, placeholder: "RENAVAM" },
        { label: "Placa", value: vehiclePlate, setValue: setVehiclePlate, placeholder: "Placa" },
        { label: "Cor", value: vehicleColor, setValue: setVehicleColor, placeholder: "Cor" },
    ];
    const vehicleBrands = [
        { label: "Selecione uma marca", value: "" },
        { label: "Chevrolet", value: "Chevrolet" },
        { label: "Fiat", value: "Fiat" },
        { label: "Ford", value: "Ford" },
        { label: "Honda", value: "Honda" },
        { label: "Hyundai", value: "Hyundai" },
        { label: "Jeep", value: "Jeep" },
        { label: "Renault", value: "Renault" },
        { label: "Toyota", value: "Toyota" },
        { label: "Volkswagen", value: "Volkswagen" },
    ];


    const handleSubmit = () => {
        console.log("Submitting vehicle data:", {
            vehicleBrand,
            vehicleModel,
            vehicleRenavam,
            vehiclePlate,
            vehicleColor,
        });
        if (!vehicleBrand || !vehicleModel || !vehiclePlate) {
            return;
        }
    };

    return (
        <View className="h-screen bg-primaryWhite">
            <View
                style={{ gap: 10, flexDirection: "column" }}
                className="p-4 gap-y-4 my-14"
            >
                <SelectInput
                    label="Marca"
                    selectedValue={vehicleBrand}
                    onValueChange={setVehicleBrand}
                    options={vehicleBrands}
                />
                {fields.map((field, index) => (
                    <View key={index}>
                        <TextInput
                            label={field.label}
                            value={field.value}
                            setValue={field.setValue}
                            placeholder={field.placeholder}
                        />
                    </View>
                ))}
                <DefaultButton
                    btnText="Cadastrar Veículo"
                    className='mt-5'
                    onPress={handleSubmit}
                />
            </View>
        </View>
    )
}

export default VehicleCreationScreen