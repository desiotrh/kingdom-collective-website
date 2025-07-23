const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Basic configuration without complex optimizations
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Web-specific configuration to handle native modules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Handle web compatibility for native modules
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Platform-specific extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

module.exports = config;
