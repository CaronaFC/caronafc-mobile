import { Text, View } from "react-native"

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";

type Props = {};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TravelRequests"
>;

type TravelRequestsRouteProp = RouteProp<RootStackParamList, "TravelRequests">;

export default function RegisterScreen({}: Props) {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const route = useRoute<TravelRequestsRouteProp>();

  const { id } = route.params;

  return (
    <View>
      <Text>ID recebido: {id}</Text>
    </View>
  )
}
