const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add html to assetExts so we can require the local html file
config.resolver.assetExts.push('html');

module.exports = config;
