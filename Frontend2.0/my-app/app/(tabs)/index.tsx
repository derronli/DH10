import { Image, TextInput, StyleSheet, ImageBackground } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { FullWindowOverlay } from 'react-native-screens';

import {Button} from '@rneui/themed';

export default function JournalScreen() {

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
              onPress={() => {
                console.log("started recording")
              }}
              title="Start Speaking"
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
