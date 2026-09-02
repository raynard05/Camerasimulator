import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';
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

  const videoUri = Image.resolveAssetSource(require('../../assets/images/PAGE 6/RULE OF THIRDS.mp4')).uri;

  const videoHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body { margin: 0; padding: 0; background-color: #000; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; flex-direction: column; color: white; font-family: sans-serif; }
        video { width: 100%; height: 100%; object-fit: contain; }
      </style>
    </head>
    <body>
      <video src="${videoUri}" autoplay playsinline controls controlsList="nodownload"></video>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={getBackgroundImage()} 
        style={styles.background}
        resizeMode="cover"
      >
        {slide === 3 && (
          <View style={styles.videoContainer} pointerEvents="box-none">
             <WebView 
               originWhitelist={['*']}
               source={{ html: videoHtml }}
               style={styles.webview}
               scrollEnabled={false}
               bounces={false}
               allowsInlineMediaPlayback={true}
               mediaPlaybackRequiresUserAction={false}
               allowFileAccess={true}
               allowUniversalAccessFromFileURLs={true}
               javaScriptEnabled={true}
               mixedContentMode="always"
               androidLayerType="hardware"
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
  webview: {
    width: '80%',
    height: '60%', // Sesuaikan agar pas dengan layar
    backgroundColor: '#000', // Wajib hitam/solid (TIDAK BOLEH transparent) agar gambar video bisa dirender di Android
    borderRadius: 10,
    overflow: 'hidden',
  }
});
