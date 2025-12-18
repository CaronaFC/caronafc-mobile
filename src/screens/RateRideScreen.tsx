import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

// Components
import DefaultButton from '../components/commom/DefaultButton';
import FormScreenWrapper from '../components/commom/FormScreenWrapper';
import { LoaderSpinner } from '../components/commom/LoaderSpinner'; // Seu loader existente
import { StarRating } from '../components/commom/StarRating';
import TextInput from '../components/commom/TextInput'; // Seu componente de input existente

// Service
import { createAvaliacao } from '../services/avaliacaoService';

// Definição dos parâmetros que essa tela recebe
type ParamList = {
  RateRide: {
    avaliadoId: number;
    viagemId: number;
    nome: string;
    tipo: 'motorista' | 'passageiro';
  };
};

export function RateRideScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'RateRide'>>();
  
  const { avaliadoId, viagemId, nome, tipo } = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (rating === 0) {
      return Alert.alert("Atenção", "Por favor, selecione uma nota de 1 a 5 estrelas.");
    }

    try {
      setIsLoading(true);
      await createAvaliacao({
        nota: rating,
        comentario: comment,
        avaliadoId,
        viagemId
      });

      Alert.alert("Sucesso", "Obrigado pela sua avaliação!", [
        { 
            text: "OK", 
            onPress: () => navigation.goBack() 
        }
      ]);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a avaliação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormScreenWrapper>
      <View className="flex-1 items-center pt-6">
        
        <Text className="text-2xl font-bold text-green-900 mb-2">
          Avaliar Carona
        </Text>
        <Text className="text-gray-500 text-center mb-8 px-4">
          Como foi a viagem com {nome}?
          {"\n"}
          <Text className="text-xs font-bold">({tipo === 'motorista' ? 'Motorista' : 'Passageiro'})</Text>
        </Text>

        {/* Estrelas */}
        <View className="mb-8 w-full items-center">
            <Text className="text-lg font-semibold text-gray-700 mb-2">
                Sua nota
            </Text>
            <StarRating rating={rating} onRatingChange={setRating} />
            <Text className="text-sm text-yellow-600 font-medium h-6">
                {rating > 0 ? `${rating} estrela(s)` : ''}
            </Text>
        </View>

        {/* Campo de Comentário */}
        <View className="w-full mb-6">
            <Text className="mb-2 text-gray-700 font-medium">Comentário (Opcional)</Text>
            <TextInput
    placeholder="Ex: Dirige muito bem, chegou no horário..."
    value={comment}
    setValue={setComment} 
    multiline={true}      
    numberOfLines={4}     
   
/>
        </View>

        {/* Botão */}
        <View className="w-full mt-4">
            {isLoading ? (
                <LoaderSpinner />
            ) : (
                <DefaultButton 
                    btnText="Enviar Avaliação" 
                    onPress={handleSubmit} 
                />
            )}
        </View>

        {/* Cancelar */}
        <View className="mt-4">
            <Text 
                onPress={() => navigation.goBack()}
                className="text-gray-400 text-sm font-medium p-4"
            >
                Pular avaliação
            </Text>
        </View>

      </View>
    </FormScreenWrapper>
  );
}