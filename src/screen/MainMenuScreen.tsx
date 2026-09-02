import React from 'react';
import { View, ImageBackground, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface MainMenuScreenProps {
  onNavigate: (screen: string) => void;
}

export const MainMenuScreen = ({ onNavigate }: MainMenuScreenProps) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/PAGE 2/tampilan menu utama.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.gridContainer}>
          {/* Baris 1 */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => onNavigate('Petunjuk')} style={styles.button}>
              <Image source={require('../../assets/images/PAGE 2/petunjuk2.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('Tujuan')} style={styles.button}>
              <Image source={require('../../assets/images/PAGE 2/tujuanpengembangan2.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('Materi')} style={styles.button}>
              <Image source={require('../../assets/images/PAGE 2/materi2.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>

          {/* Baris 2 */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => onNavigate('Simulator')} style={styles.button}>
              <Image source={require('../../assets/images/PAGE 2/simulator2.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('Evaluasi')} style={styles.button}>
              <Image source={require('../../assets/images/PAGE 2/evaluasi2.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('Profil')} style={styles.button}>
              <Image source={require('../../assets/images/PAGE 2/profil2.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    marginTop: '5%', // Menurunkan posisi tombol agar tidak menutupi judul "MENU UTAMA"
    width: '100%',
    alignItems: 'center',
    gap: 30, // Jarak antar baris diperlebar agar rapi
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30, // Jarak antar kolom
  },
  button: {
    // Wrapper tidak perlu styling spesifik lagi karena gambarnya sudah dipotong pas
  },
  buttonImage: {
    width: 220,
    height: 75, // Tinggi disesuaikan dengan proporsi asli gambar yang sudah dicrop
    resizeMode: 'contain',
  }
});
