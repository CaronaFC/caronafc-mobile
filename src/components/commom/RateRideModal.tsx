import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';

import DefaultButton from './DefaultButton';
import { LoaderSpinner } from './LoaderSpinner';
import { StarRating } from './StarRating';
import TextInput from './TextInput';

import { createAvaliacao } from '../../services/avaliacaoService';

interface RateRideModalProps {
  visible: boolean;
  avaliadoId: number;
  viagemId: number;
  nome: string;
  tipo: 'motorista' | 'passageiro';
  onClose: () => void;
  onSuccess?: () => void;
}

export function RateRideModal({
  visible,
  avaliadoId,
  viagemId,
  nome,
  tipo,
  onClose,
  onSuccess,
}: RateRideModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return Alert.alert('Atenção', 'Por favor, selecione uma nota de 1 a 5 estrelas.');
    }

    try {
      setIsLoading(true);
      await createAvaliacao({
        nota: rating,
        comentario: comment,
        avaliadoId,
        viagemId,
      });

      Alert.alert('Sucesso', 'Obrigado pela sua avaliação!', [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            onSuccess?.();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a avaliação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View className="flex-1 bg-black/70 justify-center items-center">
        {/* Close button */}
        <TouchableOpacity
          onPress={handleSkip}
          className="absolute top-10 right-10 z-50 p-2"
        >
          <FontAwesome5 name="times" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Modal Content */}
        <View className="bg-slate-900 w-11/12 rounded-2xl p-6 max-h-4/5">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full items-center justify-center mb-4">
              <FontAwesome5 name="star" size={32} color="#FFFFFF" />
            </View>
            <Text className="text-2xl font-bold text-white">Avaliar Carona</Text>
            <Text className="text-gray-400 text-center mt-2">
              Como foi a viagem com {nome}?
            </Text>
            <Text className="text-xs font-bold text-green-500 mt-1">
              ({tipo === 'motorista' ? 'Motorista' : 'Passageiro'})
            </Text>
          </View>

          {/* Star Rating */}
          <View className="mb-8 items-center">
            <Text className="text-lg font-semibold text-gray-300 mb-4">
              Sua nota
            </Text>
            <StarRating rating={rating} onRatingChange={setRating} />
            <Text className="text-sm text-yellow-500 font-medium h-6 mt-2">
              {rating > 0 ? `${rating} estrela${rating > 1 ? 's' : ''}` : ''}
            </Text>
          </View>

          {/* Comment Field */}
          <View className="mb-6">
            <Text className="text-gray-300 font-medium mb-2">
              Comentário (Opcional)
            </Text>
            <TextInput
              placeholder="Ex: Dirige muito bem, chegou no horário..."
              value={comment}
              setValue={setComment}
              multiline={true}
              numberOfLines={3}
            />
          </View>

          {/* Buttons */}
          <View className="gap-3">
            <View>
              {isLoading ? (
                <LoaderSpinner />
              ) : (
                <DefaultButton
                  btnText="Enviar Avaliação"
                  onPress={handleSubmit}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={handleSkip}
              disabled={isLoading}
              className="py-3 items-center"
            >
              <Text className="text-gray-400 text-sm font-medium">
                Pular avaliação
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
