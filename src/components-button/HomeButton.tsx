import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

interface HomeButtonProps {
  onPress: () => void;
}

export const HomeButton = ({ onPress }: HomeButtonProps) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Image 
          source={require('../../assets/images/main_assets/home.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right: 80, // Posisinya di sebelah kiri ikon musik
    zIndex: 9999,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  }
});
