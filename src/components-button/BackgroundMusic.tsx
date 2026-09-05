import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

export const BackgroundMusic = () => {
  const player = useAudioPlayer(require('../../assets/images/musik_fx/backsound_game.mp3'));
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (player) {
      player.loop = true;
      player.play();
    }
  }, [player]);

  const toggleSound = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
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
