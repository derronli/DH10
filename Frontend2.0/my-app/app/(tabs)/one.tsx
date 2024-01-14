import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button,
} from "react-native";
import PagerView from "react-native-pager-view";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Link } from "expo-router";

import EditScreenInfo from "../../components/EditScreenInfo";

export default function TabTwoScreen() {
  const [index, setIndex] = useState(0);
  const handlePageChange = (newIndex: number) => {
    setIndex(newIndex);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <PagerView
        style={styles.viewPager}
        initialPage={index}
        onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
      >
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
        <Link
          href={{
            pathname: "/five",
            // /* 1. Navigate to the details route with query params */
            params: { id: index, other: "blah" },
          }}
          style={{
            padding: 10,
            backgroundColor: "#FF6961",
            borderRadius: 4,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Apply
        </Link>
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
