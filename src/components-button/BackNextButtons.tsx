import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface BackNextButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showNext?: boolean;
}

export const BackNextButtons = ({ 
  onBack, 
  onNext, 
  showBack = true, 
  showNext = true 
}: BackNextButtonsProps) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.buttonContainer} pointerEvents="box-none">
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.button}>
            <Image 
              source={require('../../assets/images/main_assets/back.png')} 
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : <View style={styles.placeholder} />}

        {showNext ? (
          <TouchableOpacity onPress={onNext} style={styles.button}>
            <Image 
              source={require('../../assets/images/main_assets/next.png')} 
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 40,
    zIndex: 9000,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  placeholder: {
    width: 60,
    height: 60,
  }
});
