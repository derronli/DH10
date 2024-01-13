import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/screens/Home'
import ChosenTask from './src/screens/ChosenTask'

const Stack = createNativeStackNavigator();

export default function App() {

  // global state management
  const [toDoList, setToDoList] = useState([{id: 1, task:'brush your teeth' }])
  const [task, setTask] = useState('')
  const [chosenTask, setChosenTask] = useState('')

  return (
    <View>
      <Text>Open up App.js to startqfwefwef testing on your app!</Text>
    </View>
  );
}