import React from "react";

import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

const ActionableItem = ({ text, onBtnPress }) => {
  return (
    <View style={card.taskContainer}>
      <Text style={card.txt}>{text}</Text>
      <TouchableOpacity style={card.btn} onPress={() => onBtnPress(text)}>
        <Text>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const card = StyleSheet.create({
  taskContainer: {
    backgroundColor: "white",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  btn: {
    elevation: 8,
    backgroundColor: "#FF6961",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  separator: {
    height: 1,
    width: "80%",
  },
  txt: {
    color: "black",
  },
});

export default ActionableItem;
