import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { Link, Redirect } from "expo-router";
import client from "../api/client";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";

const Register = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image" ? ImagePicker.MediaTypeOptions.Images : "",
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => ({ uri: asset.uri }));
      setAddedPhotos(newPhotos);
    } else {
      setTimeout(() => {
        Alert.alert("Document Picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      addedPhotos.length === 0
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setIsSubmitting(true);
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
      const uploadedPhotos = uploadResponse.data;

      const userData = {
        username,
        email,
        password,
        addedPhotos: uploadedPhotos,
      };

      const response = await client.post("/api/register", userData);
      setUser(response.data);
      setIsLogged(true);
      Alert.alert("Registration successful. Now you can log in");
      setRedirect(true);
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration failed",
        "Something went wrong during registration."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirect) return <Redirect href={"/LogIn"} />;

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex justify-between items-center">
        <Image source={images.logo} className="h-16 w-28" resizeMode="cover" />
        <Text className="text-2xl font-semibold text-black-200">
          Sign up to HOSTME
        </Text>
      </View>

      <ScrollView style={{ paddingHorizontal: 10 }}>
        <View>
          <View className="flex items-center justify-center">
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
          </View>
          <TouchableOpacity
            onPress={() => openPicker("image")}
            className="mb-2 mt-2 items-center"
          >
            <View
              style={{
                width: 120,
                height: 50,
                backgroundColor: "lightgrey",
                borderRadius: 10,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={icons.upload}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text style={{ fontSize: 14, color: "black", marginLeft: 5 }}>
                Choose a picture
              </Text>
            </View>
          </TouchableOpacity>

          <FormField
            title="Username"
            placeholder="Enter your username"
            otherStyles="mt-3"
            value={username}
            handleChangeText={(value) => setUsername(value)}
          />
          <FormField
            title="Email"
            placeholder="Enter your email"
            value={email}
            handleChangeText={(value) => setEmail(value)}
          />
          <FormField
            title="Password"
            placeholder="Enter your password"
            value={password}
            handleChangeText={(value) => setPassword(value)}
          />

          <Button
            title="Sign Up"
            handlePress={submit}
            containerStyles="w-full mt-7"
            isLoading={isSubmitting}
          />
          <Text className="text-center text-sm text-gray-600 mb-4">
            Have an account already?{" "}
            <Link href="/LogIn" className="text-secondary-100 underline">
              Sign in
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
