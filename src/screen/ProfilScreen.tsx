import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

export const ProfilScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/PROFIL PENGEMBANG/profil.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Konten profil pengembang bisa ditambahkan di sini jika ada */}
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
});
