import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { CAMERA_VIEWER_HTML } from '../assets/camera-viewer-html';
import { Asset } from 'expo-asset';
import { Settings, Camera as CameraIcon } from 'lucide-react-native';

const APERTURE_OPTIONS = ['2.8', '3.5', '4', '4.5', '5.6', '6.7', '8', '9.5', '11', '13', '16', '19', '22'];
const SHUTTER_OPTIONS = ['1 SEC', '', '', '1/60 SEC', '', '', '', '', '', '', '', '', '1/4000 SEC'];
const SHUTTER_ACTUAL = ['1 SEC', '1/2', '1/4', '1/8', '1/15', '1/30', '1/60', '1/125', '1/250', '1/500', '1/1000', '1/2000', '1/4000 SEC'];
const ISO_OPTIONS = ['100', '200', '400', '800', '1600', '3200', '6400', '12800', '25600'];

const CustomSlider = ({ title, icon, options, displayOptions, visibleLabels, selectedIndex, setSelectedIndex, layoutMode = 'normal' }: any) => {
    const [trackLayout, setTrackLayout] = useState({ x: 0, width: 0 });
    const trackRef = useRef<View>(null);

    const handleTouch = (evt: any) => {
        if (trackLayout.width > 0) {
            const pageX = evt.nativeEvent.pageX;
            const relativeX = pageX - trackLayout.x;
            let idx = Math.round((relativeX / trackLayout.width) * (options.length - 1));
            idx = Math.max(0, Math.min(idx, options.length - 1));
            setSelectedIndex(idx);
        }
    };

    const updateLayout = () => {
        trackRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setTrackLayout({ x: pageX, width });
        });
    };

    const displayValue = displayOptions ? displayOptions[selectedIndex] : options[selectedIndex];

    return (
        <View style={styles.sliderWrapper}>
            <View style={styles.sliderHeader}>
                <Text style={styles.sliderIcon}>{icon}</Text>
                <Text style={styles.sliderTitle}>
                    {title}: <Text style={{ color: '#fff' }}>{displayValue}</Text>
                </Text>
            </View>

            <View style={styles.sliderTrackOuter}>
                <View
                    ref={trackRef}
                    style={styles.sliderTrackContainer}
                    onLayout={updateLayout}
                    onTouchStart={(e) => { updateLayout(); handleTouch(e); }}
                    onTouchMove={handleTouch}
                >
                    {/* Thumb Indicator */}
                    {trackLayout.width > 0 && (
                        <View style={[styles.thumb, { left: (selectedIndex / (options.length - 1)) * trackLayout.width - 15 }]} pointerEvents="none">
                            <View style={styles.thumbLines}>
                                <View style={styles.thumbLine} />
                                <View style={styles.thumbLine} />
                                <View style={styles.thumbLine} />
                                <View style={styles.thumbLine} />
                            </View>
                            <View style={styles.thumbArrow} />
                        </View>
                    )}

                    {/* Track Line */}
                    <View style={styles.trackLine} pointerEvents="none" />

                    {/* Ticks and Labels */}
                    <View style={styles.ticksContainer} pointerEvents="none">
                        {options.map((opt: string, i: number) => (
                            <View key={i} style={styles.tickWrapper}>
                                <View style={[styles.tick, i === selectedIndex ? styles.tickActive : null]} />

                                {layoutMode === 'staggered' && (
                                    <Text style={[styles.tickLabel, { top: i % 2 === 0 ? 5 : 20, color: i === selectedIndex ? '#fff' : '#666' }]}>
                                        {opt}
                                    </Text>
                                )}

                                {layoutMode === 'normal' && visibleLabels && visibleLabels[i] !== '' && (
                                    <Text style={[styles.tickLabel, { top: 5, color: i === selectedIndex ? '#fff' : '#666' }]}>
                                        {visibleLabels[i]}
                                    </Text>
                                )}

                                {layoutMode === 'angled' && (
                                    <View style={{ position: 'absolute', top: 5, width: 40, alignItems: 'center' }}>
                                        <Text style={[styles.tickLabelAngled, { color: i === selectedIndex ? '#fff' : '#666' }]}>
                                            {opt}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

export const CameraSimulator = () => {
    const ASSETS = [
        require('../../assets/IMG_6483.JPG.jpeg'),
        require('../../assets/IMG_4604.jpg'),
        require('../../assets/asset2.jpg')
    ];

    const webviewRef = useRef<WebView>(null);
    const [currentAssetIdx, setCurrentAssetIdx] = useState(0);
    const [apertureIdx, setApertureIdx] = useState(2); // default index for '4'
    const [shutterIdx, setShutterIdx] = useState(6); // default index for '1/60 SEC'
    const [isoIdx, setIsoIdx] = useState(2); // default index for '400'

    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    useEffect(() => {
        const loadAsset = async () => {
            try {
                const asset = Asset.fromModule(ASSETS[currentAssetIdx]);
                await asset.downloadAsync();

                if (asset.localUri) {
                    const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    setBase64Image(`data:image/jpeg;base64,${base64}`);
                }
            } catch (error) {
                console.error("Error loading asset", error);
            }
        };
        loadAsset();
    }, [currentAssetIdx]);

    useEffect(() => {
        if (isWebViewReady && base64Image) {
            webviewRef.current?.injectJavaScript(`window.setImage('${base64Image}'); true;`);
        }
    }, [isWebViewReady, base64Image]);

    useEffect(() => {
        if (isWebViewReady) {
            // Map real indices to 0.0 - 1.0 shader values
            // Aperture: smaller number (low index) = more blur (closer to 1.0)
            const apertureShaderValue = 1.0 - (apertureIdx / (APERTURE_OPTIONS.length - 1));
            // Shutter: slower (low index) = more brightness/motion blur (closer to 1.0)
            const shutterShaderValue = 1.0 - (shutterIdx / (SHUTTER_OPTIONS.length - 1));
            // ISO: higher (high index) = more brightness/noise (closer to 1.0)
            const isoShaderValue = isoIdx / (ISO_OPTIONS.length - 1);

            webviewRef.current?.injectJavaScript(`window.setEffects(${apertureShaderValue}, ${shutterShaderValue}, ${isoShaderValue}); true;`);
        }
    }, [apertureIdx, shutterIdx, isoIdx, isWebViewReady]);

    const handleMessage = async (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'init' || data.type === 'ready') {
                setIsWebViewReady(true);
            } else if (data.type === 'screenshot') {
                saveImage(data.data);
            }
        } catch (e) { }
    };

    const takePhoto = () => {
        webviewRef.current?.injectJavaScript(`window.takeScreenshot(); true;`);
    };

    const saveImage = async (base64DataUrl: string) => {
        const base64Code = base64DataUrl.split('data:image/jpeg;base64,')[1];
        const filename = `360_capture_${new Date().getTime()}.jpg`;
        const path = `${FileSystem.documentDirectory}${filename}`;

        try {
            await FileSystem.writeAsStringAsync(path, base64Code, { encoding: FileSystem.EncodingType.Base64 });
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(path, { dialogTitle: 'Simpan atau Bagikan Foto' });
            } else {
                Alert.alert('Sukses', `Foto berhasil disimpan di:\n${path}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan foto');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.webviewContainer}>
                <WebView
                    ref={webviewRef}
                    source={{ html: CAMERA_VIEWER_HTML }}
                    style={styles.webview}
                    onMessage={handleMessage}
                    originWhitelist={['*']}
                    allowFileAccess={true}
                    allowUniversalAccessFromFileURLs={true}
                    javaScriptEnabled={true}
                />

                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setIsSidebarVisible(!isSidebarVisible)}
                >
                    <Settings size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={() => setCurrentAssetIdx((prev) => (prev + 1) % ASSETS.length)}
                >
                    <Text style={styles.toggleButtonText}>
                        Ganti Lokasi
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.centerShutterButton}
                    onPress={takePhoto}
                >
                    <CameraIcon size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {isSidebarVisible && (
                <View style={[styles.controlsContainer, { flexDirection: 'row' }]}>
                    <ScrollView style={{ flex: 1, paddingRight: 15 }} showsVerticalScrollIndicator={false}>
                        <CustomSlider
                            title="APERTURE"
                            icon="📷"
                            options={APERTURE_OPTIONS}
                            selectedIndex={apertureIdx}
                            setSelectedIndex={setApertureIdx}
                            layoutMode="staggered"
                        />

                        <CustomSlider
                            title="SHUTTER SPEED"
                            icon="⏱️"
                            options={SHUTTER_OPTIONS}
                            displayOptions={SHUTTER_ACTUAL}
                            visibleLabels={SHUTTER_OPTIONS}
                            selectedIndex={shutterIdx}
                            setSelectedIndex={setShutterIdx}
                            layoutMode="normal"
                        />

                        <CustomSlider
                            title="ISO"
                            icon="☀️"
                            options={ISO_OPTIONS}
                            selectedIndex={isoIdx}
                            setSelectedIndex={setIsoIdx}
                            layoutMode="angled"
                        />
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#000',
    },
    webviewContainer: {
        flex: 3,
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    controlsContainer: {
        flex: 2,
        backgroundColor: '#1e1e24',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'space-between',
        borderLeftWidth: 1,
        borderLeftColor: '#333'
    },
    toggleButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#444',
    },
    changeImageButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#444',
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    centerShutterButton: {
        position: 'absolute',
        bottom: 30,
        left: '50%',
        marginLeft: -25,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#555',
        zIndex: 10,
    },

    // Custom Slider Styles
    sliderWrapper: {
        marginBottom: 10,
    },
    sliderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    sliderIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    sliderTitle: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    sliderTrackOuter: {
        height: 60,
        justifyContent: 'center',
    },
    sliderTrackContainer: {
        height: 40,
        justifyContent: 'center',
        position: 'relative',
    },
    trackLine: {
        height: 4,
        backgroundColor: '#111',
        borderRadius: 2,
        width: '100%',
        position: 'absolute',
        top: 18,
    },
    thumb: {
        position: 'absolute',
        top: -10,
        width: 30,
        height: 20,
        backgroundColor: '#111',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#333',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbLines: {
        flexDirection: 'row',
        width: 14,
        justifyContent: 'space-between',
        marginTop: 2,
    },
    thumbLine: {
        width: 1,
        height: 10,
        backgroundColor: '#444',
    },
    thumbArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 4,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#f00',
        position: 'absolute',
        bottom: -4,
        transform: [{ rotate: '180deg' }]
    },
    ticksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 18,
        width: '100%',
    },
    tickWrapper: {
        alignItems: 'center',
        width: 1, // small width so it aligns well
    },
    tick: {
        width: 2,
        height: 6,
        backgroundColor: '#444',
    },
    tickActive: {
        backgroundColor: '#fff',
    },
    tickLabel: {
        position: 'absolute',
        fontSize: 9,
        fontWeight: '500',
        width: 40,
        textAlign: 'center',
        left: -20, // center it
    },
    tickLabelAngled: {
        transform: [{ rotate: '-45deg' }],
        left: 0,
        top: 10,
        textAlign: 'right',
        width: 40,
    }
});
