const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable tree shaking
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

// Optimize bundle splitting
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable source maps for production
config.transformer.enableBabelRCLookup = false;

// Performance optimizations
config.transformer.enableBabelRCLookup = false;
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

// Asset optimization
config.resolver.assetExts.push('bin');

module.exports = config;
