import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Perks({ selected, onChange }) {
  const handleClick = (name) => {
    const isChecked = selected.includes(name);
    if (isChecked) {
      onChange(selected.filter(item => item !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleClick('wifi')}
      >
        <View style={[styles.checkbox, selected.includes('wifi') && styles.checked]}>
          <Text style={styles.checkboxText}>Wifi</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleClick('parking')}
      >
        <View style={[styles.checkbox, selected.includes('parking') && styles.checked]}>
          <Text style={styles.checkboxText}>Free parking spot</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleClick('tv')}
      >
        <View style={[styles.checkbox, selected.includes('tv') && styles.checked]}>
          <Text style={styles.checkboxText}>TV</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleClick('picine')}
      >
        <View style={[styles.checkbox, selected.includes('picine') && styles.checked]}>
          <Text style={styles.checkboxText}>Picine</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleClick('pets')}
      >
        <View style={[styles.checkbox, selected.includes('pets') && styles.checked]}>
          <Text style={styles.checkboxText}>Pets</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleClick('entrance')}
      >
        <View style={[styles.checkbox, selected.includes('privite entrance') && styles.checked]}>
          <Text style={styles.checkboxText}>Private entrance</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    marginVertical: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    borderRadius: 10,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'grey',
  },
  checked: {
    backgroundColor: 'orange',
  },
});
