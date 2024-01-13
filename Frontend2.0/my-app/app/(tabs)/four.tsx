import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

export default function TabTwoScreen() {
  return (
    <View>
      <View>
        <View style={styles.boxContainer}>
          <View style={styles.box1}>
            <View style={styles.textbox}>
              <Text style={styles.heading}>Bad Day</Text>
              <Text style={styles.note}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Repudiandae laudantium ipsum ab possimus esse maxime atque,
              </Text>
              <Text style={{ textAlign: "right", color: "black" }}>
                Jan 13, 2024
              </Text>
            </View>
          </View>
          <View style={styles.box2}>
            <Text>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae laudantium ipsum ab possimus esse maxime atque,
              dolorum et tempora porro harum quas laboriosam excepturi suscipit
              voluptas vero sint consequatur eligendi.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: "row",
  },
  box1: {
    flex: 1,
    backgroundColor: "#77DD77",
    marginHorizontal: 10,
    borderRadius: 8,
  },
  box2: {
    flex: 1,
    backgroundColor: "#FF0000",
    marginHorizontal: 10,
  },
  textbox: {
    backgroundColor: "transparent",
    marginHorizontal: 13,
    marginVertical: 15,
  },
  heading: {
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
  },
  note: {
    color: "black",
    marginBottom: 10,
  },
});
