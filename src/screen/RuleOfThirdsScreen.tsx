import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BackNextButtons } from '../components-button/BackNextButtons';

interface RuleOfThirdsScreenProps {
  onClose: () => void;
}

export const RuleOfThirdsScreen = ({ onClose }: RuleOfThirdsScreenProps) => {
  const [slide, setSlide] = useState(1);
  const totalSlides = 3; // rule of thirds 1, 2, dan video

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
    if (slide === 3) return require('../../assets/images/PAGE 6/tampilan video pembelajaran.png');
    return require('../../assets/images/PAGE 6/rule of thirds 1.png');
  };

  const videoSource = require('../../assets/images/PAGE 6/RULE OF THIRDS.mp4');
  const player = useVideoPlayer(videoSource, player => {
    player.loop = false;
    player.play();
  });

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={getBackgroundImage()} 
        style={styles.background}
        resizeMode="cover"
      >
        {slide === 3 && (
          <View style={styles.videoContainer} pointerEvents="box-none">
             <VideoView
               style={styles.videoPlayer}
               player={player}
               nativeControls={true}
             />
          </View>
        )}
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
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Menghilangkan warna gelap agar tidak terlihat seperti pemblokir
    zIndex: 100,
  },
  videoPlayer: {
    width: '80%',
    height: '60%', 
    backgroundColor: '#000', 
    borderRadius: 10,
    overflow: 'hidden',
  }
});
