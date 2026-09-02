import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

export const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    async function loadAudio() {
      try {
        const asset = Asset.fromModule(require('../../assets/images/MUSIK & FX/backsound game gaming.mp3'));
        await asset.downloadAsync();
        
        if (asset.localUri) {
          const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
              encoding: FileSystem.EncodingType.Base64,
          });
          setBase64Audio(`data:audio/mp3;base64,${base64}`);
          setIsPlaying(true); // default play
        }
      } catch (error) {
        console.log("Error loading audio:", error);
      }
    }
    loadAudio();
  }, []);

  useEffect(() => {
    if (base64Audio && webviewRef.current) {
      if (isPlaying) {
        webviewRef.current.injectJavaScript(`
          if (window.audio) { window.audio.play(); }
          true;
        `);
      } else {
        webviewRef.current.injectJavaScript(`
          if (window.audio) { window.audio.pause(); }
          true;
        `);
      }
    }
  }, [isPlaying, base64Audio]);

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <script>
          window.audio = new Audio('${base64Audio || ''}');
          window.audio.loop = true;
          ${isPlaying ? 'window.audio.play();' : ''}
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {base64Audio && (
        <View style={{ width: 0, height: 0, opacity: 0 }}>
          <WebView
            ref={webviewRef}
            source={{ html: htmlContent }}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      )}
      <TouchableOpacity onPress={toggleSound} style={styles.button}>
        <Image 
          source={isPlaying 
            ? require('../../assets/images/main_assets/sound on.png')
            : require('../../assets/images/main_assets/sound off.png')
          } 
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
