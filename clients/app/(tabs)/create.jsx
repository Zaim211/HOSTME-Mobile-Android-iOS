import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Redirect, router } from "expo-router";
import client from "../api/client";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Perks from "../../components/Perks";
import NumericInput from "../../components/CaseField";
import { icons, images } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function Create() {
  const { user } = useGlobalContext();
  const { id } = useLocalSearchParams();
  const [redirect, setRedirect] = useState(false);
  const [title, setTitle] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("1");
  const [checkOut, setCheckOut] = useState("1");
  const [maxGuests, setMaxGuests] = useState("1");
  const [price, setPrice] = useState("100");
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    client.get(`/api/places/${id}`).then((res) => {
      const { data } = res;
      setTitle(data?.title);
      setAddress(data?.address);
      setDescription(data?.description);
      setSelectedPerks(data?.selectedPerks);
      setExtraInfo(data?.extraInfo);
      setCheckIn(data?.checkIn);
      setCheckOut(data?.checkOut);
      setMaxGuests(data?.maxGuests);
      setPrice(data?.price);
      setAddedPhotos(data?.photos || []);
    });
  }, [id]);

  const handlePerksChange = (selected) => {
    setSelectedPerks(selected);
  };

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image" ? ImagePicker.MediaTypeOptions.Images : "",
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => ({ uri: asset.uri }));
      setAddedPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    } else {
      setTimeout(() => {
        Alert.alert("Document Picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      title === "" ||
      description === "" ||
      address === "" ||
      extraInfo === "" ||
      checkIn === "" ||
      checkOut === "" ||
      selectedPerks.length === 0 ||
      maxGuests === "" ||
      price === "" ||
      addedPhotos.length === 0
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      addedPhotos.forEach((photo, index) => {
        formData.append("photos", {
          uri: photo.uri,
          type: "image/jpeg",
          name: `photo_${index}.jpg`,
        });
      });

      const uploadResponse = await client.post("/api/upload", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      const { data: uploadedPhotos } = uploadResponse;

      const placeData = {
        title,
        description,
        address,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
        selectedPerks,
        addedPhotos: uploadedPhotos,
      };
      
      if (id) {
        response = await client.put("/api/places", {
          id,
          ...placeData,
        });
        setRedirect(true);
      } else {
        response = await client.post("/api/places", placeData);
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error creating/updating place:", error);
      Alert.alert("An error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (redirect) {
    return <Redirect href="/profile" />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
        <View className="flex flex-row justify-between items-center">
          <Image
            source={images.logo}
            className="h-16 w-28"
            resizeMode="cover"
          />
          {user ? (
            <TouchableOpacity className="px-4 mt-2" onPress={() => router.push('/profile')}>
              <Image
                source={{ uri: user.pictureProfile[0] }}
                className="h-8 w-8 rounded-full"
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
        
      <ScrollView style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <Text className="text-base text-black-100 mt-4 font-pbold text-center">
          Create a Place
        </Text>
        <FormField
          title="Title"
          value={title}
          placeholder="Title, e.g. My first place"
          onChangeText={(value) => setTitle(value)}
          otherStyles={{ marginTop: 14 }}
        />
        <FormField
          title="Address"
          value={address}
          placeholder="Address, e.g. 1234 Main St, City, State, Zip Code"
          onChangeText={(value) => setAddress(value)}
          otherStyles={{ marginTop: 14 }}
        />
        <FormField
          title="Description"
          value={description}
          placeholder="Description, e.g. This is a beautiful place to visit"
          onChangeText={(value) => setDescription(value)}
          otherStyles={{ marginTop: 14 }}
          multiline
          numberOfLines={4}
        />

        <View style={{ marginTop: 14, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "white" }}>Upload Image</Text>
          <View style={{ marginTop: 10 }}>
            {addedPhotos.length > 0 && (
              <ScrollView horizontal={true}>
                {addedPhotos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo.uri || photo }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: 10,
                      backgroundColor: "#FFFFFF",
                    }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}
            <TouchableOpacity
              onPress={() => openPicker("image")}
              style={{ marginTop: 10 }}
            >
              <View
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: "lightgrey",
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={icons.upload}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 14, color: "black", marginLeft: 5 }}>
                  Choose images
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <FormField
          title="Extra Info"
          value={extraInfo}
          onChangeText={(value) => setExtraInfo(value)}
          placeholder="House rules, etc."
          otherStyles={{ marginTop: 7, height: 100}}
          multiline
          numberOfLines={4}
        />
        <Text className="text-base text-black-100   mt-4 font-pmedium">
          Perks
        </Text>
        <Perks selected={selectedPerks} onChange={handlePerksChange} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text className="text-base text-black-100  mt-4 font-pmedium">
              Check-in Time
            </Text>
            <NumericInput
              type="number"
              value={checkIn}
              onChangeText={(value) => setCheckIn(value)}
              placeholder="14"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text className="text-base text-black-100  mt-4 font-pmedium">
              Check-out Time
            </Text>
            <NumericInput
              type="number"
              value={checkOut}
              onChangeText={(value) => setCheckOut(value)}
              placeholder="11"
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text className="text-base text-black-100  mt-4 font-pmedium">
              Number of Guests
            </Text>
            <NumericInput
              type="number"
              value={maxGuests}
              onChangeText={(value) => setMaxGuests(value)}
              placeholder="1"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text className="text-base text-black-100  mt-4 font-pmedium">
              Price per Night
            </Text>
            <NumericInput
              type="number"
              value={price}
              onChangeText={(value) => setPrice(value)}
              placeholder="100"
            />
          </View>
        </View>

        <Button
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-8 mb-4"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
