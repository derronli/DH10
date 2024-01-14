import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelplineBlock = ({ name, number, desc }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 16,
    marginTop: 5,
  },
  desc: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default HelplineBlock;
