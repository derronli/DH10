import { StyleSheet, ScrollView, View, Text, Image } from "react-native";
import PagerView from "react-native-pager-view";

import EditScreenInfo from "../../components/EditScreenInfo";

export default function TabTwoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <PagerView style={styles.viewPager} initialPage={0}>
        <View style={styles.page} key="1">
          <Image
            source={require("../../assets/images/bluedino.png")}
            style={styles.dinoimg}
          />
        </View>
        <View style={styles.page} key="2">
          <Image
            source={require("../../assets/images/yellowdino.png")}
            style={styles.dinoimg}
          />
        </View>
        <View style={styles.page} key="3">
          <Image
            source={require("../../assets/images/reddino.png")}
            style={styles.dinoimg}
          />
        </View>
      </PagerView>

      <ScrollView style={{ margin: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
          Choose Your Buddy
        </Text>
      </ScrollView>
    </View>

    // <ScrollView style={{ backgroundColor: "white" }}>
    //   <View style={{ margin: 20 }}>
    //     <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
    //       Choose Your Buddy
    //     </Text>
    //     <View style={styles.buddyCard}>
    //       <Text>hello</Text>
    //     </View>
    //     <View style={{ flex: 1 }}>
    //       <PagerView style={styles.viewPager} initialPage={0}>
    //         <View style={styles.page} key="1">
    //           <Image
    //             style={styles.img}
    //             source={{
    //               uri: "https://cdn-icons-png.flaticon.com/512/5458/5458378.png ",
    //             }}
    //           />
    //         </View>
    //         <View style={styles.page} key="2">
    //           <Text>Second page</Text>
    //         </View>
    //         <View style={styles.page} key="3">
    //           <Text>Third page</Text>
    //         </View>
    //       </PagerView>
    //     </View>
    //   </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  buddyCard: {
    backgroundColor: "black",
  },
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  dinoimg: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
