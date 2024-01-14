import { ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { Image, Button, TouchableOpacity } from "react-native";

// THIS IS ACTIONABLES SCREEN =========================================================================
export default function TabTwoScreen() {
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
        <View style={card.taskContainer}>
          <Text style={card.txt}>Wash the Dishes</Text>
          <TouchableOpacity style={card.btn}>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
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

const card = StyleSheet.create({
  taskContainer: {
    backgroundColor: "white",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  btn: {
    elevation: 8,
    backgroundColor: "#FF6961",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  separator: {
    height: 1,
    width: "80%",
  },
  txt: {
    color: "black",
  },
});
