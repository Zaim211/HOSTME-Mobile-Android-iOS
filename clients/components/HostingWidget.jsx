import React, { useState,  useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/GlobalProvider';
import client from '../app/api/client';

const HostingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [username, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const { user } = useGlobalContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      setUserName(user.username);
    }
  }, [user]);

  const calculateNumberOfNights = (checkIn, checkOut) => {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = calculateNumberOfNights(checkIn, checkOut);
  }

  async function hostThisPlace() {
    try {
      const response = await client.post('/api/hosting', {
        checkIn,
        checkOut,
        numberOfGuests,
        username,
        phone,
        price: numberOfNights * place.price,
        place: place._id,
      });
      const hostingId = response.data._id;
      navigation.navigate('profile', { id: hostingId });
    } catch (error) {
      console.error('Error hosting this place:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.priceText}>Price: ${place.price} / per night</Text>
      <View style={styles.borderContainer}>
        <View style={styles.flexRow}>
          <View style={styles.inputContainer}>
            <Text>Check in:</Text>
            <TextInput
              style={styles.input}
              value={checkIn}
              onChangeText={setCheckIn}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={[styles.inputContainer, styles.borderLeft]}>
            <Text>Check out:</Text>
            <TextInput
              style={styles.input}
              value={checkOut}
              onChangeText={setCheckOut}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>
        <View style={styles.borderTop}>
          <Text>Number of guests:</Text>
          <TextInput
            style={styles.input}
            value={String(numberOfGuests)}
            onChangeText={(text) => setNumberOfGuests(Number(text))}
            keyboardType="numeric"
          />
        </View>
        {numberOfNights > 0 && (
          <View style={styles.borderTop}>
            <Text>Your full name:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUserName}
            />
            <Text>Phone number:</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        )}
      </View>
      {numberOfNights > 0 && (
        <Text style={styles.totalText}>Total: ${numberOfNights * place.price}</Text>
      )}
      <Button title="Host this place" onPress={hostThisPlace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  borderContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  flexRow: {
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    padding: 8,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderColor: '#ddd',
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    marginVertical: 8,
  },
  totalText: {
    marginVertical: 16,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HostingWidget;
