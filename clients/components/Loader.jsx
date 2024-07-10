import { ActivityIndicator, Dimensions, Platform, View } from "react-native";

const Loader = ({ isLoading }) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;
  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={{
        height: screenHeight,
      }}
    >
      <ActivityIndicator
        color="#fff"
        animating={isLoading}
        size={osName === "android" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
