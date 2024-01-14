import { StyleSheet } from "react-native";

import JournalEntry from "../../components/JournalEntry";
import { Text, View } from "../../components/Themed";
import { Button } from "react-native";
import { useState } from "react";

export default function TabTwoScreen() {
  const [journals, setJournals] = useState<number[]>([]);

  const handleAddJournalEntry = () => {
    // The list will just be some values for now -> later on will need to change
    // Adding the value 0 to the array
    setJournals((journals) => [...journals, 0]);
    console.log(journals);
  };

  return (
    <View>
      <Button onPress={handleAddJournalEntry} title="Add" />
      <View style={{ flexDirection: "row" }}>
        {/* This is the left column */}
        <View style={styles.boxContainer}>
          {/* Only rendering even index journal entries */}
          {journals.map((journal, index) =>
            index % 2 === 0 ? <JournalEntry key={index} /> : null
          )}
        </View>

        {/* This is the right column */}
        <View style={styles.boxContainer}>
          {journals.map((journal, index) =>
            index % 2 === 1 ? <JournalEntry key={index} /> : null
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: "column",
    flex: 1,
  },
});
