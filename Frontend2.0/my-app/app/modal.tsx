import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function ModalScreen() {
  const navigation = useNavigation();

  const navigateToYou = () => {
    navigation.navigate("five");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Dino has detected someone in a bad mood! Don't be sad my friend. Head to
        the "You" tab to get some Dino tips!
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 20,
          paddingHorizontal: 20,
          paddingVertical: 8,
          backgroundColor: "#FF6961",
          borderRadius: 6,
        }}
        onPress={navigateToYou}
      >
        <Text style={{ fontWeight: "bold" }}>Dino Tips</Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
    marginHorizontal: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
