import React from "react";
import { View, Text } from "react-native";


const PlaceCard = ({
  title,
  description,
  address,
  photo,
}) => {
  return (
    <View className="flex flex-col items-center px-4 mb-14">
    <View className="flex flex-row gap-3 items-start">
      <View className="flex justify-center items-center flex-row flex-1">
        <View className="w-[46px] h-[46px] rounded-lg border flex justify-center items-center p-0.5">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-sm text-gray-100 text-center font-pregular"
            >
              {description}
            </Text>
            <Text className="text-sm text-gray-100 text-center font-pregular">
              {address}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PlaceCard;
