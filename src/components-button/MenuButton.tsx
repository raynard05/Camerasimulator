import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

interface MenuButtonProps {
  onPress: () => void;
}

export const MenuButton = ({ onPress }: MenuButtonProps) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Image 
          source={require('../../assets/images/main_assets/garis tiga.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
