import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import client from "../api/client";
import PlaceGallery from "../../components/PlaceGallery";
import HostingWidget from "../../components/HostingWidget";
import { images } from "../../constants";
import AddressLink from "../../components/AddressLink";
import { useGlobalContext } from "../../context/GlobalProvider";
import MapView, { Marker } from 'react-native-maps';

const Hosting = () => {
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();

  const fetchPlace = async () => {
    if (!id) {
      return;
    }
    try {
      const response = await client.get(`/api/places/${id}`);
      setPlace(response?.data);
    } catch (error) {
      console.error("Error fetching place:", error);
    }
  };

  useEffect(() => {
    fetchPlace();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlace();
    setRefreshing(false);
  };

  if (!place) {
    return (
      <SafeAreaView className="h-full bg-white">
        <View className="flex flex-row justify-between items-center mt-8">
          <Image
            source={images.logo}
            className="h-16 w-28"
            resizeMode="cover"
          />
          {user ? (
            <TouchableOpacity
              className="px-4 mt-2"
              onPress={() => router.push("/profile")}
            >
              <Image
                source={{ uri: user.pictureProfile[0] }}
                className="h-8 w-8 rounded-full border-radius-100"
                resizeMode="cover"
              />
              <Text className="h2-bold text-black -px-2 font-pbold text-center">
                {user.username}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text className="h2-bold text-black px-4">user</Text>
          )}
        </View>

        <View className="h-0.5 bg-gray-300 " />
        <View className="flex items-center justify-center mt-16">
          <Text className="text-center mt-2 font-pbold text-black">
            Please go to home for hosting a place
          </Text>
          <Image
            source={images.empty}
            className="h-64 w-64"
            resizeMode="cover"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-row justify-between items-center mt-8">
        <Image source={images.logo} className="h-16 w-28" resizeMode="cover" />
        {user ? (
          <TouchableOpacity
            className="px-4 mt-2"
            onPress={() => router.push("/profile")}
          >
            <Image
              source={{ uri: user.pictureProfile[0] }}
              className="h-8 w-8 rounded-full border-radius-100"
              resizeMode="cover"
            />

            <Text className="h2-bold text-black -px-2 font-pbold text-center">
              {user.username}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text className="h2-bold text-black px-4">user</Text>
        )}
      </View>
      <View className="h-0.5 bg-gray-300 " />

      <ScrollView
        className="flex"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="px-4 mt-2 font-pbold">{place.title}</Text>
        <AddressLink className="">{place?.address}</AddressLink>
        <View className="p-4">
          <PlaceGallery place={place} />
        </View>

        <View className="bg-white px-2 mt-1 shadow-lg opacity-1 border-white rounded-lg">
          <Text className="font-pbold mt-2 px-2">Description</Text>
          <Text className="font-pregulare px-4">{place.description}</Text>
          <View className="h-0.5 bg-gray-300 mt-4 mb-2" />
          <Text style={styles.infoText}>Check-in: {place.checkIn}</Text>
          <Text style={styles.infoText}>Check-out: {place.checkOut}</Text>
          <Text style={styles.infoText}>
            Max number of guests: {place.maxGuests}
          </Text>
          <View className="h-0.5 bg-gray-300 mt-4 mb-2" />
          <View className="flex flex-col justify-between mb-4">
          
            <Text className="font-pbold px-2">Perks:</Text>
     
          <View style={styles.perksContainer}>
              {place.selectedPerks.map((perk, index) => (
                <View key={index} style={styles.perkItem}>
                  <Text style={styles.perkBullet}>•</Text>
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
          
          </View>
        </View>

        <View style={styles.widgetContainer}>
          <HostingWidget place={place} />
        </View>

        {place.address ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={MapView.PROVIDER_GOOGLE}
              region={{
                
              }}
            />
          </View>
        ) : (
          <View style={styles.centeredTextContainer}>
            <Text style={styles.centeredText}>Location data not available</Text>
          </View>
        )}

        <View className="flex">
          <Text className="font-pbold mt-2 px-2">Extra Info</Text>
          <Text style={styles.infoText}>{place.extraInfo}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  perksContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  perkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  perkBullet: {
    fontSize: 18,
    color: "#000",
    marginRight: 8,
  },
  perkText: {
    fontSize: 14,
    color: "#555",
  },
  infoText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  widgetContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapContainer: {
    height: 300,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  map: {
    flex: 1,
  },
  centeredTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Hosting;
