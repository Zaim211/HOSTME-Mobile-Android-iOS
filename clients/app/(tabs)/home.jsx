import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import client from "../api/client";
import { useNavigation } from "@react-navigation/native";
import { images } from "../../constants";
import Search from "../../components/Search";
import PlaceGallery from "../../components/PlaceGallery";
import * as Animatable from "react-native-animatable";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import Loader from "../../components/Loader";

const Home = () => {
  
  const [places, setPlaces] = useState([]);
  const [latestPlaces, setLatestPlaces] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [originalPlaces, setOriginalPlaces] = useState([]);
  const { user, loading } = useGlobalContext();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 6;

  useEffect(() => {
    fetchPlaces();
    fetchLatestPlaces();
  }, []);
  

  const fetchPlaces = async () => {
    try {
      const response = await client.get("/api/places");
      setPlaces(response.data);
      setOriginalPlaces(response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  
  const fetchLatestPlaces = async () => {
    try {
      const response = await client.get("/api/latest-places");
      setLatestPlaces(response.data);
    } catch (error) {
      console.error("Error fetching latest places:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlaces();
    await fetchLatestPlaces();
    setRefreshing(false);
  };

  const handlePress = (id) => {
    navigation.navigate("hosting", { id });
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setPlaces(originalPlaces);
    } else {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setPlaces(originalPlaces);
    } else {
      try {
        const response = await client.get(`/api/places?search=${searchQuery}`);
        setPlaces(response.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching places:", error);
      }
    }
  };

  // Calculate current places
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);

  // Pagination controls
  const totalPages = Math.ceil(places.length / placesPerPage);
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const zoomIn = {
    0: {
      scale: 0.4,
    },
    1: {
      scale: 1,
    },
  };

  const zoomOut = {
    0: {
      scale: 1,
    },
    1: {
      scale: 0.9,
    },
  };

  if (loading) {
    return <View><Loader isLoading={loading}/></View>;
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-row justify-between items-center">
        <Image source={images.logo} className="h-16 w-28" resizeMode="cover" />
        {user ? (
          <TouchableOpacity className="px-4 mt-2" onPress={() => router.push("/profile")}>
            <Image
              source={{ uri: user.pictureProfile[0] }}
              className="h-8 w-8 rounded-full border-radius-100"
              resizeMode="cover"
            />
            <Text className="h2-bold text-black -px-2 font-pbold text-center">{user.username}</Text>
          </TouchableOpacity>
        ) : (
          <Text className="h2-bold text-black px-4">User</Text>
        )}
      </View>
      <View className="p-2">
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
      </View>
      <ScrollView
        className="flex-1 p-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-2">
          <Text className="p-2 font-pbold">Latest Places</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {latestPlaces.length > 0 ? (
              latestPlaces.map((place, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(place._id)}
                >
                  <Animatable.View
                    animation={index === 0 ? zoomIn : zoomOut}
                    duration={500}
                    key={place._id}
                    style={styles.latestPlaceContainer}
                  >
                    <Text className="font-pbold">{place.title}</Text>
                    <PlaceGallery place={place} />
                    <Text className="font-pregulare text-sm mt-2">
                      {place.address}
                    </Text>
                    <Text className="font-pregular">${place.price}</Text>
                 
                  </Animatable.View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-center mt-2 font-pbold text-black">
                No latest places found.
              </Text>
            )}
          </ScrollView>
          <View className="h-0.5 bg-gray-500" />
        </View>

        <View className="p-2">
          <Text className="p-1 font-pbold">All Places</Text>
          {currentPlaces.length > 0 ? (
            <View style={styles.placesContainer}>
              {currentPlaces.map((place, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.placeContainer}
                  onPress={() => handlePress(place._id)}
                >
                  <Image
                    source={{ uri: place.photos && place.photos[0] }}
                    style={styles.placeImage}
                    resizeMode="cover"
                  />
                  <View style={styles.placeDetails}>
                    <Text className="font-pbold">{place.title}</Text>
                    <Text className="font-pregulare">{place.address}</Text>
                    <Text className="font-pregular">${place.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-center mt-2 font-pbold text-black">
              No places found.
            </Text>
          )}
        </View>
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onPress={() => handleClick(index + 1)}
              title={(index + 1).toString()}
              color={index + 1 === currentPage ? "#007BFF" : "#DDDDDD"}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  placesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  placeContainer: {
    width: "48%",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  placeImage: {
    width: "100%",
    height: 200,
  },
  placeDetails: {
    padding: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
    gap: 10,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 5,
    rounded: 60,
  },
  latestPlaceContainer: {
    backgroundColor: "white",
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    width: 250,
    marginRight: 10,
  },
});

export default Home;