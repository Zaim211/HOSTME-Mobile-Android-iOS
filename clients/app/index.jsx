import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import Button from "../components/Button";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import Loader from "../components/Loader";


export default function App() {
  const { loading, user } = useGlobalContext();

  if (!loading && user) return <Redirect href="/home" />;

  if (loading && !user) return <Redirect href="/LogIn"/>;

  return (
    <SafeAreaView className="bg-white h-full">
      <Loader isLoading={loading} />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
          color: "black",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            className="w-32 h-28"
            resizeMode="cover"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] h-[298px] w-full"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
            Welcome to the best place to stay {" "}
              <Text className="text-blue-400">HOSTME</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-2"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-600 mt-7 text-center">
          HOST-ME is an innovative platform that reimagines the concept of hosting guests in residential spaces.
          Only for Hostels!
          </Text>

          <Button 
            title="Get Started" 
            containerStyles="mt-7 w-full" 
            handlePress={() => router.push('/LogIn')}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" Style="light" />
    </SafeAreaView>
  );
}
