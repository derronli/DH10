import { ScrollView, StyleSheet } from "react-native";

import JournalEntry from "../../components/JournalEntry";
import { Text, View } from "../../components/Themed";
import { Button } from "react-native";
import { useState } from "react";

export default function TabTwoScreen() {
  // ****** Will hold the title and text of each journal entry -> so they can be mapped + passed as props to the JournalEntry component
  const [journals, setJournals] = useState<number[]>([]);

  // will rotate between all of them
  const noteColours = ["#77DD77", "#FF6961", "#AEC6CF", "#FAC898"];

  // ***** Inputs: Title + Text of journal entry (will likely be called externally)
  const handleAddJournalEntry = () => {
    // The list will just be some values for now -> later on will need to change
    // Adding the value 0 to the array

    setJournals((journals) => [...journals, 0]);
    console.log(journals);
  };

  return (
    <ScrollView>
      <Button onPress={handleAddJournalEntry} title="Add" />
      <View style={{ flexDirection: "row" }}>
        {/* This is the left column */}
        <View style={styles.boxContainer}>
          {/* Only rendering even index journal entries */}
          {journals.map((journal, index) =>
            index % 2 === 0 ? (
              <JournalEntry
                key={index}
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
