import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

export default function TabTwoScreen() {
  return (
    <View>
      <View>
        <View style={styles.boxContainer}>
          <View style={styles.box1}>
            <View>
              <Text>ASDASD</Text>
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
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  box2: {
    flex: 1,
    backgroundColor: "#FF0000",
    marginHorizontal: 10,
  },
});
