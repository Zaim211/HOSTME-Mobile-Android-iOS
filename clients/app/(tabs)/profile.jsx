import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import client from "../api/client";
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoBox from "../../components/InfoBox";
import { icons, images } from "../../constants";
import PlaceGallery from "../../components/PlaceGallery";
import Button from "../../components/Button";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { setUser, user } = useGlobalContext();
  const [places, setPlaces] = useState([]);
  const [hostings, setHostings] = useState([]);
  const [hosted, setHosted] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchHostedPlacesUsers = async () => {
    try {
      const response = await client.get("/api/hosted-places");
      setHosted(response.data);
    } catch (error) {
      console.error("Error fetching hosted places:", error);
    }
  };

  const fetchUserPlaces = async () => {
    try {
      const response = await client.get("/api/user-places");
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching user places:", error);
    }
  };

  const fetchHostedPlaces = async () => {
    try {
      const response = await client.get("/api/hosting");
      setHostings(response.data);
    } catch (error) {
      console.error("Error fetching hosted places:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserPlaces();
    await fetchHostedPlaces();
    await fetchHostedPlacesUsers();
    setRefreshing(false);
  };

  const logout = async () => {
    await client.post("/api/logout");
    setUser(null);
    router.replace("LogIn");
  };

  useEffect(() => {
    fetchUserPlaces();
    fetchHostedPlaces();
    fetchHostedPlacesUsers();
  }, []);

  const deletePlace = async (id) => {
    try {
      await client.delete(`/api/places/${id}`);
      setPlaces(places.filter((place) => place._id !== id));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  async function deleteHosting(id) {
    try {
      await client.delete(`/api/hostings/${id}`);
      setHostings(hostings.filter((hosting) => hosting._id !== id));
    } catch (error) {
      console.error("Error deleting hosting:", error);
    }
  }

  const onPressCreate = () => {
    navigation.navigate("create");
  };

  return (
    <>
    <SafeAreaView className="bg-white h-[190px]">
      <View className="flex items-center justify-between flex-row-reverse">
        <TouchableOpacity onPress={logout} className="flex px-2">
          <Image
            source={icons.logout}
            className="w-8 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View className="flex flex-row justify-between items-center">
          {user ? (
            <View className="px-4 mt-2">
              <Image
                source={{ uri: user.pictureProfile[0] }}
                style={{ height: 40, width: 40, borderRadius: 20 }}
                resizeMode="cover"
              />

              <Text className="h2-bold text-black -px-2 font-pbold text-center">
                {user.username}
              </Text>
            </View>
          ) : (
            <Text className="h2-bold text-black px-4">Text</Text>
          )}
        </View>
        
      </View>
      <View className="h-0.5 bg-gray-300 " />
      <View className="flex items-center mt-4">
          <Button
            handlePress={onPressCreate}
            title="create new place"
            containerStyles="w-[182px] "
          />
        </View>
      

     
    </SafeAreaView>
    <SafeAreaView className="h-full bg-white flex-1">
       <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        

        {places.length > 0 ? (
          <View style={styles.sectionContainer}>
            <InfoBox
              title="Your places"
              subtitle="Created"
              titleStyles="text-xl mt-4"
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {places.map((place) => (
                <View key={place._id} style={styles.placeContainer}>
                  <View style={styles.imageContainer}>
                    {place.photos && (
                      <Image
                        source={{ uri: place.photos[0] }}
                        style={styles.placeImage}
                      />
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.placeTitle}>{place.title}</Text>
                    <Text style={styles.placeDescription}>
                      {place.description}
                    </Text>
                    <Text style={styles.placeAddress}>{place.address}</Text>
                    <View style={styles.actions}>
                      <TouchableOpacity onPress={() => deletePlace(place._id)}>
                        <Text style={styles.deleteButton}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className="h-0.5 bg-gray-500" />
          </View>
        ) : (
          <View>
            <View className="flex items-center justify-center mt-4">
              <Text className="text-center mt-2 font-pbold text-black">
                Create your place.
              </Text>
              <Image
                source={images.empty}
                className="h-64 w-64"
                resizeMode="cover"
              />
            </View>
            <View className="h-0.5 bg-gray-500" />
          </View>
        )}

        {hostings.length > 0 ? (
          <View style={styles.sectionContainer}>
            <InfoBox
              title="Your places"
              subtitle="Hosted"
              titleStyles="text-xl mt-4"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {hostings.map((hosting) => (
                <View key={hosting._id} style={styles.hostingCard}>
                  <PlaceGallery place={hosting.place} />
                  <View style={styles.cardContent}>
                    <Text style={styles.placeTitle}>{hosting.place.title}</Text>
                    <Text style={styles.infoText}>
                      Check-in: {new Date(hosting.checkIn).toLocaleDateString()}
                    </Text>
                    <Text style={styles.infoText}>
                      Check-out:{" "}
                      {new Date(hosting.checkOut).toLocaleDateString()}
                    </Text>
                    <Text style={styles.infoText}>
                      Total price: ${hosting.price}
                    </Text>
                    <TouchableOpacity
                      onPress={() => deleteHosting(hosting._id)}
                    >
                      <Text style={styles.deleteButton}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className="h-0.5 bg-gray-500" />
          </View>
        ) : (
          <View>
            <View className="flex items-center justify-center mt-4">
              <Text className="text-center mt-2 font-pbold text-black">
                You haven't hosted any place yet.
              </Text>
              <Image
                source={images.empty}
                className="h-64 w-64"
                resizeMode="cover"
              />
            </View>
            <View className="h-0.5 bg-gray-500" />
          </View>
        )}

        {hosted.length > 0 ? (
          <View style={styles.sectionContainer}>
            <InfoBox
              title="Clients Hosted Your places"
              subtitle="Please contact them by number."
              titleStyles="text-xl mt-4"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {hosted.map((hostedPlace) => (
                <View key={hostedPlace._id} style={styles.hostingCard}>
                  <PlaceGallery place={hostedPlace.place} />
                  <View style={styles.cardContent}>
                    <Text style={styles.placeTitle}>
                      {hostedPlace.place.title}
                    </Text>
                    <Text>Information about Guests:</Text>
                    <Text style={styles.infoText}>
                      Hosted by: {hostedPlace.username}
                    </Text>
                    <Text style={styles.infoText}>
                      Check-in:{" "}
                      {new Date(hostedPlace.checkIn).toLocaleDateString()}
                    </Text>
                    <Text style={styles.infoText}>
                      Check-out:{" "}
                      {new Date(hostedPlace.checkOut).toLocaleDateString()}
                    </Text>
                    <Text style={styles.infoText}>
                      Total price: ${hostedPlace.price}
                    </Text>
                    <Text>Phone: {hostedPlace.phone}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="flex items-center justify-center mt-4">
            <Text className="text-center mt-2 font-pbold text-black">
              Clients hasn't been hosted your place yet.
            </Text>
            
            <Image
              source={images.empty}
              className="h-64 w-64"
              resizeMode="cover"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  logoutButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  logoutIcon: {
    width: 60,
    height: 34,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 2,
  },
  placeContainer: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
    width: 250,
    marginRight: 10,
    borderRadius: 8,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  placeImage: {
    aspectRatio: 1,
    flex: 1,
  },
  placeDetails: {
    flex: 1,
    marginBottom: 40,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeDescription: {
    fontSize: 14,
    color: "black",
    marginVertical: 8,
    fontWeight: "bold",
  },
  placeAddress: {
    fontSize: 12,
    color: "black",
  },
  actions: {
    flexDirection: "row",
    marginTop: 2,
  },
  deleteButton: {
    color: "#FF0000",
    marginRight: 16,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  hostingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
    width: 250,
    marginRight: 10,
  },
  cardContent: {
    padding: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
});

export default Profile;
