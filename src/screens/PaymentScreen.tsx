import { FontAwesome5 } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation";
import { getPaymentById, PaymentResponse } from "../services/paymentService";
import { getTravelById } from "../services/travelService";
import { RequestDetails } from "../types/request";

type PaymentScreenRouteProp = RouteProp<RootStackParamList, "PaymentScreen">;
type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "PaymentScreen">;

export default function PaymentScreen() {
    const navigation = useNavigation<PaymentScreenNavigationProp>();
    const route = useRoute<PaymentScreenRouteProp>();

    // Recebe os dados da viagem via parâmetros
    const { travelId, solicitationId } = route.params;

    const { userData } = useAuth();

    const [travelData, setTravelData] = useState<RequestDetails | null>(null);
    const [travelMotorista, setTravelMotorista] = useState<any>(null);
    const [travelPassageiro, setTravelPassageiro] = useState<any>(null);
    const [payment, setPayment] = useState<PaymentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [processingPayment, setProcessingPayment] = useState<boolean>(false);

    const fetchTravelData = useCallback(async () => {
        if (!userData?.data.id) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Buscando dados da viagem com ID:', travelId);

            // Buscar dados da viagem
            const travel = await getTravelById(travelId);

            console.log('Dados da viagem recebidos:', travel);

            // Verificar se travel existe
            if (!travel) {
                throw new Error("Dados da viagem não encontrados");
            }

            // Verificar propriedades essenciais com fallbacks seguros
            const travelInfo: RequestDetails = {
                id: travel.id || 0,
                status: 'pendente', // Status padrão
                dataSolicitacao: new Date().toISOString(),
                solicitacaoId: solicitationId,

                // Usuario com dados seguros
                usuario: {
                    id: userData.data.id,
                    nome_completo: userData.data.nome_completo,
                    email: userData.data.email,
                    numero: userData.data.numero,
                    cpf: userData.data.cpf || '',
                    senha: '',
                    imagem: userData.data.imagem || '',
                    data_nascimento: userData.data.data_nascimento || '',
                    data_criacao: userData.data.data_criacao || '',
                    veiculos: []
                },

                // Motorista com verificação de segurança
                motorista: {
                    id: travel.motorista?.id || 0,
                    nome: travel.motorista?.nome || travel.motorista?.nome || 'Motorista não informado',
                    numero: travel.motorista?.numero || '',
                    email: travel.motorista?.email || '',
                },

                // Viagem com verificação de segurança
                viagem: {
                    id: travel.id || 0,
                    destino: travel.jogo.estadio.cidade || 'Destino não informado',
                    estadio: travel.jogo.estadio.nome || 'Estádio não informado',
                    horario: travel.horario || 'Horário não informado',
                    valor: travel.valorPorPessoa || '0',
                    data_viagem: travel.jogo.data || 'Data não informada',
                }
            };

            console.log('TravelInfo estruturado:', travelInfo);
            setTravelData(travelInfo);

        } catch (err: any) {
            console.error("Erro detalhado ao carregar dados da viagem:", err);

            // Log mais detalhado do erro
            if (err.response) {
                console.error("Resposta do servidor:", err.response.status, err.response.data);
            }

            if (err.response?.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
            } else if (err.response?.status === 404) {
                setError("Viagem não encontrada. Verifique se o ID está correto.");
            } else {
                setError(`Erro ao carregar informações da viagem: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, [travelId, userData, solicitationId]);

    const handleCreatePayment = async () => {
        if (!travelData || !userData) return;

        setProcessingPayment(true);
        try {
            const paymentResponse = await getPaymentById(travelData.id);
            setPayment(paymentResponse);
            // Abrir link do pagamento PIX
            if (paymentResponse.pixUrl) {
                await Linking.openURL(paymentResponse.pixUrl);
                Alert.alert("Pagamento PIX", "O link do PIX foi aberto no navegador.");
            }

        } catch (err: any) {
            if (err.response?.status === 401) {
                Alert.alert("Sessão Expirada", "Sua sessão expirou. Faça login novamente.", [
                    { text: "OK", onPress: () => navigation.navigate("Login") }
                ]);
            } else {
                Alert.alert("Erro", "Não foi possível processar o pagamento. Tente novamente.");
            }
        } finally {
            setProcessingPayment(false);
        }
    };

    useEffect(() => {
        fetchTravelData();
    }, [fetchTravelData]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#1E40AF" />
                <Text className="mt-2 text-blue-700 font-semibold">
                    Carregando informações da viagem...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-4 bg-gray-50">
                <FontAwesome5 name="exclamation-circle" size={50} color="#EF4444" />
                <Text className="text-red-600 mb-4 text-center font-semibold text-lg">{error}</Text>
                <TouchableOpacity
                    onPress={fetchTravelData}
                    className="bg-blue-600 px-6 py-3 rounded-lg shadow-md"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-semibold text-lg">Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!travelData) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-gray-600">Nenhuma informação disponível</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        Finalizar Pagamento
                    </Text>
                    <Text className="text-gray-600">
                        Confirme os dados da viagem e proceda com o pagamento
                    </Text>
                </View>

                {/* Informações da Viagem */}
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
                    <Text className="text-lg font-semibold text-gray-800 mb-3 flex-row items-center">
                        <FontAwesome5 name="route" size={16} color="#1E40AF" /> Detalhes da Viagem
                    </Text>

                    <View className="space-y-2">
                        <View className="flex-row items-center mb-2">
                            <FontAwesome5 name="map-marker-alt" size={14} color="#22C55E" />
                            <Text className="ml-3 text-gray-700">
                                <Text className="font-medium">Destino:</Text> {travelData.viagem.destino}
                            </Text>
                        </View>

                        <View className="flex-row items-center mb-2">
                            <FontAwesome5 name="flag-checkered" size={14} color="#EF4444" />
                            <Text className="ml-3 text-gray-700">
                                <Text className="font-medium">Estádio:</Text> {travelData.viagem.estadio}
                            </Text>
                        </View>

                        <View className="flex-row items-center mb-2">
                            <FontAwesome5 name="calendar" size={14} color="#6366F1" />
                            <Text className="ml-3 text-gray-700">
                                <Text className="font-medium">Data:</Text> {new Date(travelData.viagem.data_viagem).toLocaleDateString('pt-BR')}
                            </Text>
                        </View>

                        <View className="border-b border-gray-200 mb-4 mt-4"></View>

                        <Text className="text-lg font-semibold text-gray-800 mb-3 flex-row items-center">
                            <FontAwesome5 name="user-tie" size={16} color="#1E40AF" /> Motorista
                        </Text>

                        <View className="space-y-2">
                            <View className="flex-row items-center mb-2">
                                <FontAwesome5 name="user" size={14} color="#6366F1" />
                                <Text className="ml-3 text-gray-700">{travelData.motorista.nome}</Text>
                            </View>

                            <View className="flex-row items-center mb-2">
                                <FontAwesome5 name="envelope" size={14} color="#2563EB" />
                                <Text className="ml-3 text-gray-700">{travelData.motorista.email}</Text>
                            </View>

                            <View className="flex-row items-center">
                                <FontAwesome5 name="phone" size={14} color="#22C55E" />
                                <Text className="ml-3 text-gray-700">{travelData.motorista.numero}</Text>
                            </View>
                        </View>
                    

                        <View className="border-b border-gray-200 mb-4 mt-4"></View>


                        <Text className="text-lg font-semibold text-gray-800 mb-3 flex-row items-center">
                            <FontAwesome5 name="user-friends" size={16} color="#1E40AF" /> Passageiro
                        </Text>

                        <View className="space-y-2">
                            <View className="flex-row items-center mb-2">
                                <FontAwesome5 name="user" size={14} color="#6366F1" />
                                <Text className="ml-3 text-gray-700">{travelData.usuario.nome_completo}</Text>
                            </View>

                            <View className="flex-row items-center">
                                <FontAwesome5 name="envelope" size={14} color="#2563EB" />
                                <Text className="ml-3 text-gray-700">{travelData.usuario.email}</Text>
                            </View>
                        </View>

                    </View>
                </View>
                {/* Valor Total */}
                <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-semibold text-green-800">Valor Total:</Text>
                        <Text className="text-2xl font-bold text-green-600">
                            R$ {Number(travelData.viagem.valor).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                </View>

                {/* Botão de Pagamento */}
                {!payment ? (
                    <TouchableOpacity
                        onPress={handleCreatePayment}
                        disabled={processingPayment}
                        className={`${processingPayment ? 'bg-gray-400' : 'bg-blue-600'} rounded-lg py-4 shadow-lg`}
                        activeOpacity={0.8}
                    >
                        <View className="flex-row justify-center items-center">
                            {processingPayment ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <FontAwesome5 name="credit-card" size={18} color="white" />
                            )}
                            <Text className="text-white font-bold text-lg ml-2">
                                {processingPayment ? 'Processando...' : 'Pagar com PIX'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View className="bg-green-100 border border-green-300 rounded-lg p-4">
                        <FontAwesome5 name="check-circle" size={24} color="#22C55E" />
                        <Text className="text-green-800 font-semibold text-center mb-2">
                            Pagamento criado com sucesso!
                        </Text>
                        <Text className="text-green-700 text-center">
                            O link do PIX foi aberto automaticamente
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}