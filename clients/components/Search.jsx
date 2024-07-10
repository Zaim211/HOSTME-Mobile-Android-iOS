import React from "react";
import { View, Image, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { icons } from "../constants";

const Search = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <View className="flex flex-row bg-gray-200 items-center rounded-lg p-2">
      <TextInput
        className="text-base p-1 text-black flex-1 font-pregular"
        value={searchQuery}
        placeholder="Search for places..."
        placeholderTextColor="#CDCDE0"
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TouchableOpacity onPress={onSearch}>
        <Image source={icons.search} className="w-5 h-5 ml-2" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};


export default Search;
