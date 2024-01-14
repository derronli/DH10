import { StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Card } from '@rneui/themed';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, } from '../../components/Themed';

const PressableCard = () => {

  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    console.log('Card Pressed!');
    setIsExpanded(!isExpanded);
  };

  return (
    <Pressable onPress={handlePress}>
        <Card>
            <Card.Title style={styles.title}>Journey Entry</Card.Title>
            <Card.Divider />
                {isExpanded ? (
              <View>
                <Text>
                  Expanded Content
                  A lot more stuff
                  qofijwef
                </Text>
                {/* Add additional content for expanded state */}
              </View>
            ) : (
              <View>
                <Text>Collapsed Content</Text>
                {/* Add additional content for collapsed state */}
              </View>
            )}
          </Card>
      </Pressable>
  );
};

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />

      <PressableCard></PressableCard>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
