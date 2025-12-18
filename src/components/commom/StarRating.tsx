import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
}

export function StarRating({ rating, onRatingChange, maxStars = 5 }: StarRatingProps) {
  return (
    <View className="flex-row gap-2 justify-center my-4">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isSelected = starValue <= rating;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onRatingChange(starValue)}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={isSelected ? "star" : "star-o"} // "star" é cheia, "star-o" é vazia
              size={40}
              color={isSelected ? "#EAB308" : "#9CA3AF"} // Amarelo ou Cinza (gray-400)
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}