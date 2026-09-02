/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

import React, { useState } from 'react';
import { HomeScreen } from './src/screen/HomeScreen';
import { MainMenuScreen } from './src/screen/MainMenuScreen';
import { CameraSimulator } from './src/screen/CameraSimulator';
import { PetunjukScreen } from './src/screen/PetunjukScreen';
import { TujuanScreen } from './src/screen/TujuanScreen';
import { MateriScreen } from './src/screen/MateriScreen';
import { RuleOfThirdsScreen } from './src/screen/RuleOfThirdsScreen';
import { BackgroundMusic } from './src/components-button/BackgroundMusic';
import { HomeButton } from './src/components-button/HomeButton';
import { MenuButton } from './src/components-button/MenuButton';

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onStart={() => setCurrentScreen('MainMenu')} />;
      case 'MainMenu':
        return <MainMenuScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
      case 'Petunjuk':
        return <PetunjukScreen />;
      case 'Tujuan':
        return <TujuanScreen />;
      case 'Materi':
        return <MateriScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
      case 'RuleOfThirds':
        return <RuleOfThirdsScreen onClose={() => setCurrentScreen('Materi')} />;
      case 'Simulator':
        return <CameraSimulator />;
      default:
        // Render empty or construction page for unimplemented screens
        return <View style={{flex: 1, backgroundColor: '#050720'}} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      {currentScreen !== 'Home' && <HomeButton onPress={() => setCurrentScreen('Home')} />}
      {currentScreen !== 'Home' && currentScreen !== 'MainMenu' && currentScreen !== 'RuleOfThirds' && (
        <MenuButton onPress={() => setCurrentScreen('MainMenu')} />
      )}
      <BackgroundMusic />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
});

export default App;
