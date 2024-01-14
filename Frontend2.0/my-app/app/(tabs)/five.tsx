import { ScrollView, StyleSheet, Image } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

import { ListItem } from '@rneui/themed';

import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import HelplineBlock from "../../components/HealthlineBlock"

import MentalHealthInfo from "../../mental_health/health_resources";

function MentalHealthAccordion(): any {

  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);

  return <View>
    <ListItem.Accordion
  content={
    <>
      <ListItem.Content>
        <ListItem.Title>Mental Health Resources</ListItem.Title>
      </ListItem.Content>
    </>
  }
  isExpanded={expanded}
  onPress={() => {
    setExpanded(!expanded);
  }}
>
  <ListItem>
    <ListItem.Content>
      <View>
        {MentalHealthInfo.Helpline.map(({ name, number, desc }, index) => (
          <HelplineBlock key={index} name={name} number={number} desc={desc} />
        ))}
      </View>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
</ListItem.Accordion>
<ListItem.Accordion
  content={
    <>
      <ListItem.Content>
        <ListItem.Title>Mental Health Tips</ListItem.Title>
      </ListItem.Content>
    </>
  }
  isExpanded={expanded2}
  onPress={() => {
    setExpanded2(!expanded2);
  }}
>
  <ListItem>
    <ListItem.Content>
      <ListItem.Subtitle>{MentalHealthInfo.Tips}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
</ListItem.Accordion>
</View>
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
      {MentalHealthAccordion()}
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
