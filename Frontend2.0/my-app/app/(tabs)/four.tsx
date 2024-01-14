import { ScrollView, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import JournalEntry from "../../components/JournalEntry";
import { Text, View } from "../../components/Themed";
import { Button } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabTwoScreen() {
  useEffect(() => {
    getData();
  }, []);

  // ****** Will hold the title and text of each journal entry -> so they can be mapped + passed as props to the JournalEntry component
  const [journals, setJournals] = useState<string[]>([]);

  // will rotate between all of them
  const noteColours = ["#61a8ff", "#f07069", "#81e3b7", "#FAC898"];

  // ***** Inputs: Title + Text of journal entry (will likely be called externally)
  const handleAddJournalEntry = (txt: string) => {
    // The list will just be some values for now -> later on will need to change
    // Adding the value 0 to the array

    setJournals((journals) => [...journals, txt]);
    console.log(journals);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(`summaryNote${journals.length}`);
      if (value !== null) {
        // value previously stored
        setJournals((journals) => [...journals, value]);
      }
    } catch (e) {
      // error reading value
    }
  };
  const onPressRefresh = () => {
    console.log(journals);
    getData();
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <FontAwesome.Button
        name="refresh"
        backgroundColor="white"
        color="black"
        onPress={onPressRefresh}
        style={{ marginLeft: 10 }}
      ></FontAwesome.Button>
      <Button
        onPress={() => handleAddJournalEntry("asdasdasdasd")}
        title="Add"
      />
      <View
        style={{
          backgroundColor: "#D3D3D3",
          marginHorizontal: 12,
          padding: 5,
          borderRadius: 12,
          marginVertical: 8,
        }}
      >
        <Text style={{ marginHorizontal: 10, marginVertical: 2 }}>
          Search your notes...
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {/* This is the left column */}
        <View style={styles.boxContainer}>
          {/* Only rendering even index journal entries */}
          {journals.map((journal, index) =>
            index % 2 === 0 ? (
              <JournalEntry
                key={index}
                journalBody={journal}
                colour={noteColours[index % noteColours.length]}
              />
            ) : null
          )}
        </View>

        {/* This is the right column */}
        <View style={styles.boxContainer}>
          {journals.map((journal, index) =>
            index % 2 === 1 ? (
              <JournalEntry
                key={index}
                journalBody={journal}
                colour={noteColours[index % noteColours.length]}
              />
            ) : null
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    flex: 1,
  },
});
