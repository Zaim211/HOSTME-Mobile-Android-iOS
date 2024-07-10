import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const BtnPagintion = ({title, handlePress, isLoading}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        activeOpacity={0.8}
        // className={`bg-secondary-100 min-h-[60px] justify-center items-center rounded-xl ${containerStyles}
        // {isLoading ? 'opacity-50' : ''}`}
    >
        <Text className={`text-primary text-lg font-semibold`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default BtnPagintion