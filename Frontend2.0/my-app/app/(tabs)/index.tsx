import { get_response, get_summary } from "../../models/llm_call";
import {
  Image,
  TextInput,
  StyleSheet,
  ImageBackground,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Text, View } from "../../components/Themed";
import { FullWindowOverlay } from "react-native-screens";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import Tts from 'react-native-tts';
import Spokestack from 'react-native-spokestack';
import ChatBubble from 'react-native-chat-bubble';
import * as Speech from 'expo-speech';

import { Button } from "@rneui/themed";

export default function JournalScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const [inputText, setInputText] = useState("");
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [responseText, setResponseText] = useState("Content here should be easy to change");

  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id = 0 } = params as { id?: number };
  let audio_mode = "villager";

  const pics = [
    require("../../assets/images/dino0.png"),
    require("../../assets/images/dino1.png"),
    require("../../assets/images/dino2.png"),
    require("../../assets/images/dino3.png"),
  ];

  const personalities = [
    "kind but stern",
    "kind and really silly",
    "blut and serious, kinda mean",
    "kind and goofy pirate talks only like a pirate"
  ]

  const handleInputChange = (text: string) => {
    setInputText(text);
    console.log(text);
  };

  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const moveAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -6,
            duration: 500, // Adjust the duration as needed
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 500, // Adjust the duration as needed
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 500, // Adjust the duration as needed
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500, // Adjust the duration as needed
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const isSpeaking = async () => {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        moveAnimation.stop();
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -12,
            duration: 250, // Adjust the duration as needed
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 250, // Adjust the duration as needed
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        moveAnimation.start();
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 500, // Adjust the duration as needed
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500, // Adjust the duration as needed
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    isSpeaking(); // Initial check

    // Check every second if speech is still active
    const interval = setInterval(() => {
      isSpeaking();
    }, 1000);

    return () => {
      clearInterval(interval);
      moveAnimation.stop();
    };
  }, [translateY, scale]);

  useEffect(() => {
    // Simply get recording permission upon first render
    async function getPermission() {
      await Audio.requestPermissionsAsync()
        .then((permission) => {
          console.log("Permission Granted: " + permission.granted);
          setAudioPermission(!!permission.granted);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Call function to get permission
    getPermission();
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
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();
      console.log("Starting Recording");
      // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY revmoed
      await newRecording.prepareToRecordAsync();
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus("recording");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/animal_crossing.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  async function stopRecording() {
    try {
      if (recording && recordingStatus === "recording") {
        console.log("Stopping Recording");
        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI();
        // Create a file name for the recording
        const fileName = `recording-${Date.now()}.wav`;

        if (recordingUri) {
          // Move the recording to the new directory with the new file name
          await FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + "recordings/",
            { intermediates: true }
          );
          await FileSystem.moveAsync({
            from: recordingUri,
            to: FileSystem.documentDirectory + "recordings/" + `${fileName}`,
          });
        }

        // This is for simply playing the sound back
        // const playbackObject = new Audio.Sound();
        // await playbackObject.loadAsync({ uri: FileSystem.documentDirectory + 'recordings/' + `${fileName}` });
        // await playbackObject.playAsync();

        // resert our states to record again
        setRecording(null);
        setRecordingStatus("stopped");
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  }

  async function handleRecordButtonPress() {
    if (recording) {
      const audioUri = await stopRecording();
      console.log("Saved audio file to", audioUri);
      const text = await get_summary(inputText);
      const text2 = await get_response(inputText, personalities[id]);
      setResponseText(text2)
      if (audio_mode == "villager") {
        await playSound();
      } else if (audio_mode == "model") {
        Speech.speak(text2)
      }
    } else {
      await startRecording();
    }
  }

  const image = require("../../assets/images/beach.jpg");

  return (
    <ImageBackground
      source={image}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ChatBubble
          isOwnMessage={true}
          bubbleColor='#ffffff'
          tailColor='#ffffff'
          withTail={true}
          style = {{height:200, width:700, margin:5}}
        >
          <Text style = {{fontSize:18}}>{responseText}</Text>
        </ChatBubble>
        </View>

        <View style={styles.imgContainer}>
          {/* Dino Image at the Bottom Left */}
          <Animated.Image
            source={pics[id]} // Replace with your image path
            style={[
              styles.dino_image,
              { transform: [{ translateY }, { scale }] },
            ]}
          />
        </View>

        <View style={{ backgroundColor: "rgba(52, 52, 52, 0)" }}>
          <TextInput
            style={styles.textHide}
            onChangeText={handleInputChange}
            value={inputText}
          ></TextInput>
        </View>

        <View style={styles.button}>
          <Button
            onPress={handleRecordButtonPress}
            title={recording ? "Recording" : "Not Recording"}
            color="#FF3D00"
            size="lg"
            titleStyle={{ fontSize: 18 }}
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
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  backgroundContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  textContainer: {
    flex: 3,
    margin: 30,
    backgroundColor: "rgba(52, 52, 52, 0)",
    flexDirection: 'column-reverse',
    // justifyContent: 'flex-start',
  },
  imgContainer: {
    flex: 2,
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    backgroundColor: "rgba(52, 52, 52, 0)",
    alignItems: "flex-end",
    marginBottom: 20,
    marginRight: -20,
  },
  buttonContainer: {
    flex: 2,
    // margin: 16,
    // marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  dino_image: {
    width: 325,
    height: 325,
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  button: {
    width: "90%",
    margin: 20,
    marginBottom: 75,
    backgroundColor: "red",
    borderRadius: 30,
  },
  textHide: {
    height: 40,
    color: "rgba(52, 52, 52, 0)",
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
});
