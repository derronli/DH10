import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
export default function TabTwoScreen() {
  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_TOKEN, // YOUR_OPEN_AI_TOKEN
  })

  return (
    <View>
      <Text>Recording: {recording}</Text>
      <Text>Speaking: {speaking}</Text>
      <Text>Transcribing: {transcribing}</Text>
      <Text>Transcribed Text: {transcript.text}</Text>
      <TouchableOpacity onPress={() => {startRecording(); console.log('qwef')}}>
        <View style={styles.button}>
          <Text>Start</Text>
          
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => pauseRecording()}>
        <View style={styles.button}>
          <Text>Pause</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => stopRecording()}>
        <View style={styles.button}>
          <Text>Stop</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
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
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
});
