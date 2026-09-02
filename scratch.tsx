import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, PanResponder } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { CAMERA_VIEWER_HTML } from '../assets/camera-viewer-html';
import { Asset } from 'expo-asset';

const APERTURE_OPTIONS = ['2.8', '3.5', '4', '4.5', '5.6', '6.7', '8', '9.5', '11', '13', '16', '19', '22'];
const SHUTTER_OPTIONS = ['1 SEC', '', '', '1/60 SEC', '', '', '', '', '', '', '', '', '1/4000 SEC'];
const SHUTTER_ACTUAL = ['1', '1/2', '1/4', '1/8', '1/15', '1/30', '1/60', '1/125', '1/250', '1/500', '1/1000', '1/2000', '1/4000'];
const ISO_OPTIONS = ['100', '200', '400', '800', '1600', '3200', '6400', '12800', '25600'];

const CustomSlider = ({ title, iconType, iconName, options, visibleLabels, selectedIndex, setSelectedIndex, layoutMode = 'normal' }: any) => {
    const [trackWidth, setTrackWidth] = useState(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                updateIndexFromTouch(evt.nativeEvent.locationX);
            },
            onPanResponderMove: (evt) => {
                updateIndexFromTouch(evt.nativeEvent.locationX);
            },
        })
    ).current;

    const updateIndexFromTouch = (x: number) => {
        if (trackWidth > 0) {
            let idx = Math.round((x / trackWidth) * (options.length - 1));
            idx = Math.max(0, Math.min(idx, options.length - 1));
            setSelectedIndex(idx);
        }
    };

    return (
        <View style={styles.sliderWrapper}>
            <View style={styles.sliderHeader}>
                {iconType === 'Ionicons' && <Ionicons name={iconName} size={24} color="#fff" />}
                {iconType === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={iconName} size={24} color="#fff" />}
                {iconType === 'Feather' && <Feather name={iconName} size={24} color="#fff" />}
                <Text style={styles.sliderTitle}>{title}: <Text style={{ color: '#fff' }}>{options[selectedIndex]}</Text></Text>
            </View>
            
            <View 
                style={styles.sliderTrackContainer} 
                onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
                {...panResponder.panHandlers}
            >
                {/* Thumb Indicator */}
                {trackWidth > 0 && (
                    <View style={[styles.thumb, { left: (selectedIndex / (options.length - 1)) * trackWidth - 15 }]}>
                        <View style={styles.thumbLines} />
                        <View style={styles.thumbArrow} />
                    </View>
                )}
                
                {/* Track Line */}
                <View style={styles.trackLine} />
                
                {/* Ticks and Labels */}
                <View style={styles.ticksContainer}>
                    {options.map((opt: string, i: number) => (
                        <View key={i} style={styles.tickWrapper}>
                            <View style={[styles.tick, i === selectedIndex ? styles.tickActive : null]} />
                            
                            {layoutMode === 'staggered' && (
                                <Text style={[styles.tickLabel, { marginTop: i % 2 === 0 ? 5 : 20, color: i === selectedIndex ? '#fff' : '#666' }]}>
                                    {opt}
                                </Text>
                            )}
                            
                            {layoutMode === 'normal' && visibleLabels && visibleLabels[i] && (
                                <Text style={[styles.tickLabel, { color: i === selectedIndex ? '#fff' : '#666' }]}>
                                    {visibleLabels[i]}
                                </Text>
                            )}

                            {layoutMode === 'angled' && (
                                <Text style={[styles.tickLabel, styles.tickLabelAngled, { color: i === selectedIndex ? '#fff' : '#666' }]}>
                                    {opt}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};
