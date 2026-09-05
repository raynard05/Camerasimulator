import React from 'react';
import { View, ImageBackground, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface SimulatorIntroScreenProps {
  onStart: () => void;
}

export const SimulatorIntroScreen = ({ onStart }: SimulatorIntroScreenProps) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/PAGE 14/224.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Info Button (Left) */}
          <TouchableOpacity style={styles.infoButton} onPress={() => {}}>
            <Image 
              source={require('../../assets/images/PAGE 14/235.png')} 
              style={styles.sideButtonImage} 
            />
          </TouchableOpacity>

          {/* Checklist Button (Right) */}
          <TouchableOpacity style={styles.checklistButton} onPress={() => {}}>
            <Image 
              source={require('../../assets/images/PAGE 14/236.png')} 
              style={styles.sideButtonImage} 
            />
          </TouchableOpacity>

          {/* Start Button (Center Bottom) */}
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Image 
              source={require('../../assets/images/PAGE 14/237.png')} 
              style={styles.startButtonImage} 
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050720',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    position: 'relative',
  },
  infoButton: {
    position: 'absolute',
    left: '5%',
    top: '40%',
  },
  checklistButton: {
    position: 'absolute',
    right: '5%',
    top: '40%',
  },
  sideButtonImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  startButton: {
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center',
  },
  startButtonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  }
});
