import { ScrollView, StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";
import { Image, Button, TouchableOpacity } from "react-native";
import ActionableItem from "../../components/ActionableItem";
import { useState } from "react";

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
      <View style={styles.section1}>
        <Text style={styles.greeting}>Hey! How are you feeling today?</Text>
      </View>
      <View
        style={[
          styles.section1,
          { alignItems: "flex-end", height: 150, justifyContent: "center" },
        ]}
      >
        <Image
          style={styles.img}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/5458/5458378.png ",
          }}
        />
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
  section1: {
    backgroundColor: "gray",
    height: 75,
    padding: 20,
  },
  section2: {
    backgroundColor: "white",
  },
  greeting: {
    fontSize: 20,
    color: "black",
    maxWidth: 200,
  },
  img: {
    width: 100,
    height: 100,
  },
});
