import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

export const PetunjukScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/PAGE 3/tampilan petunjuk.png')} 
        style={styles.background}
        resizeMode="cover"
      />
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
  }
});
