import { get_actions, get_summary } from "../../models/llm_call";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button } from "@rneui/themed";

export default function JournalScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const [inputText, setInputText] = useState("");
  const [summCounter, setSummCounter] = useState(0);
  const [actions, setActions] = useState<string[]>([]);

  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id = 0 } = params as { id?: number };

  const pics = [
    require("../../assets/images/dino0.png"),
    require("../../assets/images/dino1.png"),
    require("../../assets/images/dino2.png"),
  ];

  const handleInputChange = (text: string) => {
    setInputText(text);
    console.log(text);
  };

  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    clearAll();

    // Move the image up and down in a loop
    const moveAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -12,
            duration: 1000, // Adjust the duration as needed
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1000, // Adjust the duration as needed
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 1000, // Adjust the duration as needed
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000, // Adjust the duration as needed
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    moveAnimation.start();

    return () => {
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

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }

    console.log("Done.");
  };
  const storeActionData = async (value: string) => {
    try {
      await AsyncStorage.setItem("my-key", value);
    } catch (e) {
      // saving error
    }
  };

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem(`summaryNote${summCounter}`, value);
      let index = summCounter + 1;
      setSummCounter(index);
      console.log("/this is summ counter");
      console.log(summCounter);
    } catch (e) {
      // saving error
    }
  };

  async function handleRecordButtonPress() {
    if (recording) {
      const audioUri = await stopRecording();
      console.log("Saved audio file to", audioUri);
      const text = await get_summary(inputText);
      // NEW EDITS ===================
      console.log(text);
      storeData(text);
      setInputText("");
      // 3 endpoints -> actions, mood, help
      // actions can be put on a different page -> (get action items button) -> Input: summarized text
      console.log("ACTIONABLES");
      const ac = await get_actions(inputText);
      console.log(ac);
      storeActionData(ac);

      // Mood -> can be detected from the voice -> Output integer 1(sad) or 5 (happy) ->  If sad: "Would you like help" button
      // That would call help endpoint -> (could be little slide up window, something like that to highlight OR dino says it?)
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
          <Text style={styles.title}>Home Screeffqewfwefwefn</Text>
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
    // flexDirection: 'row',
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
