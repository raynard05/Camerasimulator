import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { BackNextButtons } from '../components-button/BackNextButtons';

interface RuleOfThirdsScreenProps {
  onClose: () => void;
}

export const RuleOfThirdsScreen = ({ onClose }: RuleOfThirdsScreenProps) => {
  const [slide, setSlide] = useState(1);
  const totalSlides = 2; // rule of thirds 1.png & rule of thirds 2.png

  const handleNext = () => {
    if (slide < totalSlides) {
      setSlide(slide + 1);
    }
  };

  const handleBack = () => {
    if (slide > 1) {
      setSlide(slide - 1);
    } else {
      onClose();
    }
  };

  const getBackgroundImage = () => {
    if (slide === 1) return require('../../assets/images/PAGE 6/rule of thirds 1.png');
    if (slide === 2) return require('../../assets/images/PAGE 6/rule of thirds 2.png');
    return require('../../assets/images/PAGE 6/rule of thirds 1.png');
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={getBackgroundImage()} 
        style={styles.background}
        resizeMode="cover"
      >
        <BackNextButtons 
          onBack={handleBack} 
          onNext={handleNext} 
          showBack={true}
          showNext={slide < totalSlides}
        />
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
  }
});
