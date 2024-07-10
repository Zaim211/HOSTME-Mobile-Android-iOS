import React from 'react';
import { View, Text, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function AddressLink({ children, style }) {
  const combinedStyle = [styles.defaultStyle, style];

  const handlePress = () => {
    Linking.openURL(`https://maps.google.com/?q=${children}`);
  };

  return (
    <TouchableOpacity style={combinedStyle} onPress={handlePress}>
      <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={styles.icon}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </Svg>
      <Text className="font-pregular">{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    width: 24,
    height: 24,
    color: 'currentColor',
  },

});
