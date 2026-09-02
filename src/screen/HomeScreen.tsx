import React from 'react';
import { View, ImageBackground, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface HomeScreenProps {
  onStart: () => void;
}

export const HomeScreen = ({ onStart }: HomeScreenProps) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/PAGE 1/tampilan awal.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity onPress={onStart} style={styles.startButton}>
          <Image
            source={require('../../assets/images/PAGE 1/start awal.png')}
            style={styles.startImage}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050720', // Gelap sesuai tema
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    position: 'absolute',
    top: '47%', // Geser ke atas sedikit
    marginLeft: -135, // Geser ke kiri sedikit
  },
  startImage: {
    width: 190,
    height: 170,
    resizeMode: 'contain',
  }
});
