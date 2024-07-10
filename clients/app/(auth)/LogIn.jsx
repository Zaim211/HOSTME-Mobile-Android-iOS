import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import { useState } from "react";
import Button from "../../components/Button";
import { Link, router } from "expo-router";
import client from "../api/client";
import { useGlobalContext } from "../../context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLogged } = useGlobalContext();

  const loggeIn = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await client.post("/api/login", { email, password });
     
      const { token, user } = res.data;
      if (token) {
        await AsyncStorage.setItem("token", token);
        setUser(user);
        setIsLogged(true);
        Alert.alert("Login successful");
        router.replace("/home");
      } else {
        Alert.alert("Error", "No token received from server");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full mt-8">
      <ScrollView>
        <View className="px-2 min-h-[50vh] justify-center items-center">
          <Image source={images.logo} className="h-12 w-28" resizeMode="cover" />
          <Text className="text-2xl mt-10 font-psemibold text-semibold text-black-200">
            Sign In to HOSTME
          </Text>
          <FormField
            title="Email"
            placeholder="Enter your email"
            otherStyles="mt-3"
            keyboardType="email-address"
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
            title="Login"
            handlePress={loggeIn}
            containerStyles="w-full mt-7"
            isLoading={isSubmitting}
          />
          <Text className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link href="/Register" className="text-secondary-100 underline">
              Register
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
