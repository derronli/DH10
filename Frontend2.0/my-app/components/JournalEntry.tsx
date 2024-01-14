import React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "./Themed";

const JournalEntry = ({ colour, journalBody }) => {
  return (
    <View style={[styles.box1, { backgroundColor: colour }]}>
      <View style={styles.textbox}>
        <Text style={styles.heading}>Bad Day</Text>
        <Text style={styles.note}>{journalBody}</Text>
        <Text style={{ textAlign: "right", color: "black" }}>Jan 13, 2024</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box1: {
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
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

export default JournalEntry;
