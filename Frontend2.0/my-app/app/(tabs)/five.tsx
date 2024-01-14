import { StyleSheet, Image } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id = 0, other } = params as { id?: number; other?: any };

  const pics = [
    require("../../assets/images/dino0.png"),
    require("../../assets/images/dino1.png"),
    require("../../assets/images/dino2.png"),
  ];

  // const getImageSource = (number: number) => {
  //   switch (number) {
  //     case 0:
  //       return (
  //         <Image
  //           source={require("../../assets/images/dino0.png")}
  //           style={{ width: 100, height: 100 }}
  //         />
  //       );
  //     case 1:
  //       return (
  //         <Image
  //           source={require("../../assets/images/dino1.png")}
  //           style={{ width: 100, height: 100 }}
  //         />
  //       );
  //     case 2:
  //       return (
  //         <Image
  //           source={require("../../assets/images/dino2.png")}
  //           style={{ width: 100, height: 100 }}
  //         />
  //       );
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Three</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Image source={pics[id]} style={{ width: 100, height: 100 }} />
      <EditScreenInfo path="app/(tabs)/three.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
