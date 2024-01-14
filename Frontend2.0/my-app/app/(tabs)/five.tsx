import { ScrollView, StyleSheet, Image } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

import { ListItem } from '@rneui/themed';

import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import MentalHealthInfo from "../../mental_health/health_resources";

function MentalHealthAccordion(): any {

  const [expanded, setExpanded] = useState(false);

  return <ListItem.Accordion
  content={
    <>
      <ListItem.Content>
        <ListItem.Title>List Accordion</ListItem.Title>
      </ListItem.Content>
    </>
  }
  isExpanded={expanded}
  onPress={() => {
    setExpanded(!expanded);
  }}
>
  <ListItem bottomDivider>
    <ListItem.Content>
      <ListItem.Title>Mental Health Resources</ListItem.Title>
      <ListItem.Subtitle>{MentalHealthInfo.Helpline}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
  <ListItem bottomDivider>
    <ListItem.Content>
      <ListItem.Title>Mental Health Tips</ListItem.Title>
      <ListItem.Subtitle>{MentalHealthInfo.Tips}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
</ListItem.Accordion>
}

export default function TabFiveScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id = 0} = params as { id?: number};

  const pics = [
    require("../../assets/images/dino0.png"),
    require("../../assets/images/dino1.png"),
    require("../../assets/images/dino2.png"),
  ];

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <Text style={styles.title}>You</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Image source={pics[id]} style={{ width: 100, height: 100 }} />
        
      </View>
    </ScrollView>
  )
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
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
});
