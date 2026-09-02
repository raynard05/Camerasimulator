import React from 'react';
import { View, ImageBackground, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface MateriScreenProps {
  onNavigate: (screen: string) => void;
}

export const MateriScreen = ({ onNavigate }: MateriScreenProps) => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/PAGE 5/tampilan awal materi.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.gridContainer}>
          {/* Baris 1 */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => onNavigate('RuleOfThirds')} style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/rule of thirds.webp')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/leading lines.webp')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/framing.webp')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/simetris.webp')} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>

          {/* Baris 2 */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/fill the frame.webp')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/perspektif.webp')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/rule of odds.webp')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../../assets/images/PAGE 5/noise.webp')} style={styles.buttonImage} />
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
    marginTop: '5%', // Menyesuaikan dengan tinggi judul "MATERI"
    width: '80%',
    alignItems: 'center',
    gap: 15, // Jarak antar baris
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15, // Jarak antar kolom
  },
  button: {
    // Style tambahan jika perlu
  },
  buttonImage: {
    width: 140, // Disesuaikan agar muat 4 kolom
    height: 120,
    resizeMode: 'contain',
  }
});
