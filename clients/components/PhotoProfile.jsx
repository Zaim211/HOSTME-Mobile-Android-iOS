// import React from "react";
// import { Image, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { icons } from "../constants";

// export default function PhotoProfile({ addedPhotos, setAddedPhotos }) {
//   const openPicker = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     });

//     if (!result.canceled) {
//       const newPhotos = result.assets.map((asset) => ({ uri: asset.uri }));
//       setAddedPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
//     } else {
//       Alert.alert("Image picking cancelled");
//     }
//   };

//   return (
//     <View style={{ marginTop: 14, marginBottom: 20 }}>
//       <View style={{ marginTop: 10 }}>
//         {addedPhotos.length > 0 && (
//           <ScrollView horizontal={true}>
//             {addedPhotos.map((photo, index) => (
//               <Image
//                 key={index}
//                 source={{ uri: photo.uri }}
//                 style={{
//                   width: 100,
//                   height: 100,
//                   borderRadius: 10,
//                   marginRight: 10,
//                   backgroundColor: "#FFFFFF",
//                 }}
//                 resizeMode="contain"
//               />
//             ))}
//           </ScrollView>
//         )}
//         <TouchableOpacity onPress={openPicker} style={{ marginTop: 10 }}>
//           <View
//             style={{
//               width: "100%",
//               height: 50,
//               backgroundColor: "lightgrey",
//               borderRadius: 10,
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Image
//               source={icons.upload}
//               style={{ width: 20, height: 20 }}
//               resizeMode="contain"
//             />
//             <Text style={{ fontSize: 14, color: "black", marginLeft: 5 }}>
//               Upload photo profile
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }