import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { icons } from '../constants';

const NumericInput = ({
  value,
  onChangeText,
  placeholder,
  title,
  otherStyles,
  keyboardType = 'numeric', // Specify numeric keyboard type
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: 16, ...otherStyles }}>
      <Text style={{ fontSize: 16, color: '#FFFFFF', fontFamily: 'Poppins-Medium' }}>
        {title}
      </Text>
      <View
        style={{
          width: 120,
          height: 50,
          paddingHorizontal: 16,
          backgroundColor: 'white',
          borderRadius: 20,
          borderWidth: 2,
          borderColor: 'grey',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{ color: 'black', flex: 1, fontSize: 16, fontFamily: 'Poppins-SemiBold' }}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#8D8D8D"
          keyboardType={keyboardType} // Ensure numeric keyboard
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default NumericInput;
