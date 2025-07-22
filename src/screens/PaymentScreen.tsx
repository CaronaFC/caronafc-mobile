import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { createPayment, PaymentData, PaymentResponse } from "../services/paymentService";
import { getTravel } from "../services/travelService";

type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';

export default function PaymentScreen() {
  const { userData, userToken } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { travelId } = route.params as { travelId: number };

  const [travelDetails, setTravelDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: 'qrcode', color: '#32D74B' },
    { id: 'credit', name: 'Cartão de Crédito', icon: 'credit-card', color: '#007AFF' },
    { id: 'debit', name: 'Cartão de Débito', icon: 'credit-card', color: '#FF9500' },
    { id: 'cash', name: 'Dinheiro', icon: 'money-bill', color: '#34C759' },
  ];

  const fetchTravelDetails = useCallback(async () => {
    if (!userData?.data?.id || !userToken) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (!travelId) {
        throw new Error("ID da viagem não fornecido");
      }
      
      const travelData = await getTravel(travelId);
      setTravelDetails(travelData);
    } catch (error: any) {
      console.error("Error fetching travel details:", error);
      
      if (error.response?.status === 401) {
        setError("Erro de autenticação. Faça login novamente.");
      } else if (error.response?.status === 404) {
        setError("Viagem não encontrada.");
      } else {
        setError("Erro ao carregar detalhes da viagem.");
      }
    } finally {
      setLoading(false);
    }
  }, [travelId, userToken, userData]);

  useEffect(() => {
    fetchTravelDetails();
  }, [fetchTravelDetails]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const calculateTotal = () => {
    if (!travelDetails) return 0;
    const basePrice = parseFloat(travelDetails.valorPorPessoa);
    const serviceFee = basePrice * 0.05; // Taxa de serviço de 5%
    return basePrice + serviceFee;
  };

  const getServiceFee = () => {
    if (!travelDetails) return 0;
    const basePrice = parseFloat(travelDetails.valorPorPessoa);
    return basePrice * 0.05;
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Erro", "Selecione um método de pagamento");
      return;
    }
    setShowConfirmModal(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      if (!userData?.data?.id || !selectedPaymentMethod || !travelDetails) {
        throw new Error("Dados insuficientes para processar pagamento");
      }

      const basePrice = parseFloat(travelDetails.valorPorPessoa);
      const serviceFee = getServiceFee();
      const total = calculateTotal();

      const paymentData: PaymentData = {
        travelId: travelId,
        passengerId: userData.data.id,
        paymentMethod: selectedPaymentMethod,
        amount: basePrice,
        serviceFee: serviceFee,
        total: total
      };

      console.log("Processando pagamento:", paymentData);
      
      const response = await createPayment(paymentData);
      setPaymentResponse(response);
      
      console.log("Resposta do pagamento:", response);

      // Tratar diferentes tipos de resposta baseado no método de pagamento
      if (response.status === 'completed') {
        setShowConfirmModal(false);
        Alert.alert(
          "Pagamento Realizado!", 
          response.message || "Seu pagamento foi processado com sucesso.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else if (response.status === 'pending') {
        setShowConfirmModal(false);
        
        if (selectedPaymentMethod === 'pix') {
          // Para PIX, mostrar QR Code ou abrir app
          setShowPaymentDetails(true);
          
          if (response.paymentUrl) {
            Alert.alert(
              "PIX Gerado",
              "Seu código PIX foi gerado. Você pode copiar o código ou abrir no seu app de pagamento.",
              [
                {
                  text: "Copiar Código",
                  onPress: () => {
                    // Implementar cópia do código PIX
                    Alert.alert("Código copiado!", "Cole no seu app de pagamento");
                  }
                },
                {
                  text: "Abrir App",
                  onPress: () => {
                    if (response.paymentUrl) {
                      Linking.openURL(response.paymentUrl);
                    }
                  }
                }
              ]
            );
          }
        } else {
          // Para outros métodos, aguardar confirmação
          Alert.alert(
            "Pagamento Iniciado",
            response.message || "Aguarde a confirmação do pagamento.",
            [
              {
                text: "OK",
                onPress: () => navigation.goBack()
              }
            ]
          );
        }
      } else {
        throw new Error(response.message || "Falha no processamento do pagamento");
      }

    } catch (error: any) {
      console.error("Erro no pagamento:", error);
      Alert.alert(
        "Erro no Pagamento", 
        error.message || "Falha ao processar pagamento. Tente novamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentDetails(false);
    Alert.alert(
      "Pagamento Confirmado!",
      "Sua reserva foi confirmada com sucesso.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2 text-gray-600">Carregando informações da viagem...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-red-500 text-center mb-4 text-lg">{error}</Text>
        <TouchableOpacity
          onPress={fetchTravelDetails}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!travelDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">Viagem não encontrada</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header da Viagem */}
        <View className="bg-white p-4 shadow-sm">
          <Text className="text-2xl font-bold text-center mb-2">{travelDetails.destino}</Text>
          <Text className="text-gray-600 text-center">{formatDate(travelDetails.dataViagem)} • {travelDetails.horario}</Text>
        </View>

        {/* Resumo da Viagem */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3 text-gray-800">📍 Detalhes da Viagem</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Origem:</Text>
              <Text className="font-medium flex-1 text-right">{travelDetails.origem}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Destino:</Text>
              <Text className="font-medium flex-1 text-right">{travelDetails.destino}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Vagas disponíveis:</Text>
              <Text className="font-medium">{travelDetails.vagasDisponiveis}</Text>
            </View>
          </View>
        </View>

        {/* Informações do Motorista */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3 text-gray-800">👤 Motorista</Text>
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
              <FontAwesome5 name="user" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-base">{travelDetails.motorista.nome}</Text>
              <Text className="text-gray-600">{travelDetails.motorista.telefone}</Text>
            </View>
          </View>
        </View>

        {/* Informações do Veículo */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3 text-gray-800">🚗 Veículo</Text>
          <View className="space-y-2">
            <Text className="text-base">{travelDetails.veiculo.marca} {travelDetails.veiculo.modelo}</Text>
            <Text className="text-gray-600">{travelDetails.veiculo.cor} • {travelDetails.veiculo.placa}</Text>
            <Text className="text-gray-600">{travelDetails.veiculo.tipoVeiculo.descricao}</Text>
          </View>
        </View>

        {/* Passageiros Confirmados */}
        {travelDetails.passageiros && travelDetails.passageiros.length > 0 && (
          <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
            <Text className="text-lg font-semibold mb-3 text-gray-800">
              👥 Passageiros Confirmados ({travelDetails.passageiros.length})
            </Text>
            {travelDetails.passageiros.map((passageiro: any, index: number) => (
              <View key={passageiro.id || index} className="flex-row items-center py-2">
                <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
                  <FontAwesome5 name="check" size={12} color="white" />
                </View>
                <Text className="font-medium">{passageiro.nome}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Resumo do Pagamento */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3 text-gray-800">💰 Resumo do Pagamento</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Valor da viagem:</Text>
              <Text className="font-medium">{formatCurrency(travelDetails.valorPorPessoa)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Taxa de serviço (5%):</Text>
              <Text className="font-medium">{formatCurrency(getServiceFee())}</Text>
            </View>
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold">Total:</Text>
                <Text className="text-lg font-bold text-green-600">{formatCurrency(calculateTotal())}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Métodos de Pagamento */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3 text-gray-800">💳 Método de Pagamento</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPaymentMethod(method.id as PaymentMethod)}
              className={`flex-row items-center p-3 rounded-lg mb-2 border ${
                selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: method.color }}
              >
                <FontAwesome5 name={method.icon as any} size={16} color="white" />
              </View>
              <Text className="flex-1 font-medium">{method.name}</Text>
              {selectedPaymentMethod === method.id && (
                <FontAwesome5 name="check-circle" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botão de Pagamento */}
      <View className="bg-white p-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handlePayment}
          disabled={!selectedPaymentMethod}
          className={`py-4 rounded-lg ${
            selectedPaymentMethod ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white text-center font-bold text-lg">
            Pagar {formatCurrency(calculateTotal())}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Confirmação */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white mx-4 rounded-lg p-6 w-80">
            <Text className="text-xl font-bold text-center mb-4">Confirmar Pagamento</Text>
            
            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Viagem: {travelDetails.destino}</Text>
              <Text className="text-gray-600 mb-2">
                Método: {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
              </Text>
              <Text className="text-lg font-bold">Total: {formatCurrency(calculateTotal())}</Text>
            </View>

            {isProcessing ? (
              <View className="items-center py-4">
                <ActivityIndicator size="large" color="#007AFF" />
                <Text className="mt-2 text-gray-600">Processando pagamento...</Text>
              </View>
            ) : (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 bg-gray-200 rounded-lg"
                >
                  <Text className="text-center font-semibold">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={processPayment}
                  className="flex-1 py-3 bg-green-500 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">Confirmar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes do Pagamento (PIX, etc.) */}
      <Modal
        visible={showPaymentDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentDetails(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white mx-4 rounded-lg p-6 w-80">
            <Text className="text-xl font-bold text-center mb-4">
              {selectedPaymentMethod === 'pix' ? 'Pagamento PIX' : 'Detalhes do Pagamento'}
            </Text>
            
            {paymentResponse && (
              <View className="mb-4">
                <Text className="text-gray-600 mb-2">Status: {paymentResponse.status}</Text>
                <Text className="text-gray-600 mb-2">ID: {paymentResponse.transactionId}</Text>
                {paymentResponse.qrCode && (
                  <Text className="text-gray-600 mb-2">QR Code disponível</Text>
                )}
              </View>
            )}

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowPaymentDetails(false)}
                className="flex-1 py-3 bg-gray-200 rounded-lg"
              >
                <Text className="text-center font-semibold">Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePaymentSuccess}
                className="flex-1 py-3 bg-green-500 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">Pagamento Feito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}