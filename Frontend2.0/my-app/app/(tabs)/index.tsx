import { Image, TextInput, StyleSheet, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Text, View } from '../../components/Themed';
import { FullWindowOverlay } from 'react-native-screens';

import {Button} from '@rneui/themed';

export default function JournalScreen() {

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);

  useEffect(() => {

    // Simply get recording permission upon first render
    async function getPermission() {
      await Audio.requestPermissionsAsync().then((permission) => {
        console.log('Permission Granted: ' + permission.granted);
        setAudioPermission(!!permission.granted)
      }).catch(error => {
        console.log(error);
      });
    }

    // Call function to get permission
    getPermission()
    // Cleanup upon first render
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  async function startRecording() {
    try {
      // needed for IoS
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })
      }

      const newRecording = new Audio.Recording();
      console.log('Starting Recording')
      // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY revmoed
      await newRecording.prepareToRecordAsync();
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    try {

      if (recording && recordingStatus === 'recording') {
        console.log('Stopping Recording')
        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI();
        // Create a file name for the recording
        const fileName = `recording-${Date.now()}.wav`;
        if (recordingUri) {

          // Move the recording to the new directory with the new file name
          await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', { intermediates: true });
          await FileSystem.moveAsync({
            from: recordingUri,
            to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`
          });
        }

        // This is for simply playing the sound back
        const playbackObject = new Audio.Sound();
        await playbackObject.loadAsync({ uri: FileSystem.documentDirectory + 'recordings/' + `${fileName}` });
        await playbackObject.playAsync();

        // resert our states to record again
        setRecording(null);
        setRecordingStatus('stopped');
      }

    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  async function handleRecordButtonPress() {
    if (recording) {
      const audioUri = await stopRecording();
      console.log('Saved audio file to', audioUri);
    } else {
      await startRecording();
    }
  }

  const image = require('../../assets/images/beach.jpg');

  return (
    // <View style={styles.backgroundContainer}>
      <ImageBackground source={image} resizeMode="cover" style={styles.background}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Home Screeffqewfwefwefn</Text>
          </View>

          <View style={styles.imgContainer}>
            {/* Dino Image at the Bottom Left */}
            <Image
              source={require('../../assets/images/dino.png')} // Replace with the path to your dino image
              style={styles.dino_image}
            />
          </View>

          <View style={styles.button}>
            <Button
              onPress={handleRecordButtonPress}
              title={recording ? 'Recording' : 'Not Recording'}
              color="#FF3D00"
              size='lg'
              titleStyle={{fontSize:18}}
            />
          </View> 
        </View>
      </ImageBackground>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0)'
  },
  backgroundContainer: {
    flex: 1
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 3,
    margin:30,
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
  },
  imgContainer: {
    flex: 2,
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    backgroundColor: 'rgba(52, 52, 52, 0)',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: -20
  },
  buttonContainer: {
    flex:2,
    // margin: 16,
    // marginBottom: 40,
    alignItems: 'center',
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
  dino_image: {
    width: 325,
    height: 325,
    backgroundColor: 'rgba(52, 52, 52, 0)'
  },
  button: {
    width: "90%", 
    margin: 20, 
    marginBottom:75, 
    backgroundColor: "red", 
    borderRadius: 30,
  }
});
