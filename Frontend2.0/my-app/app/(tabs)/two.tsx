import { ScrollView, StyleSheet } from "react-native";

import { Text } from "../../components/Themed";
import { Image, Button, TouchableOpacity, View } from "react-native";
import ActionableItem from "../../components/ActionableItem";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

// THIS IS ACTIONABLES SCREEN =========================================================================
export default function TabTwoScreen() {
  const [actionItems, setActionItems] = useState<string[]>([
    "Wash the dishes",
    "Clean my room",
    "Eat food",
    "Do Homework :(",
  ]);

  const handleBtnPress = (txt) => {
    let cp = [...actionItems];
    let i = cp.indexOf(txt);
    if (i != -1) {
      cp.splice(i, 1);
      setActionItems(cp);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{}}>
        <LinearGradient
          colors={["#f0bebb", "transparent"]}
          style={styles.background}
        />
        <View style={styles.section1}>
          <Text style={styles.greeting}>Hey! How are you feeling today?</Text>
        </View>
        <View
          style={[
            styles.section1,
            { alignItems: "flex-end", height: 110, justifyContent: "center" },
          ]}
        >
          <Image
            style={styles.img}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/5458/5458378.png ",
            }}
          />
        </View>
      </View>
      <View style={styles.section2}>
        {actionItems.map((txt, index) => (
          <ActionableItem key={index} text={txt} onBtnPress={handleBtnPress} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  section1: {
    height: 120,
    padding: 20,
  },
  section2: {
    backgroundColor: "white",
  },
  greeting: {
    fontSize: 30,
    color: "black",
    fontWeight: "600",
    maxWidth: 300,
  },
  img: {
    width: 100,
    height: 100,
  },
});
