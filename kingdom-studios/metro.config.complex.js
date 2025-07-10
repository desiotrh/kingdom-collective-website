const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enhanced performance optimizations
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true, // Improves startup time significantly
  },
});

// Enable tree shaking and better module resolution
config.resolver.platforms = ['native', 'ios', 'android', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Optimized aliases for better tree shaking
config.resolver.alias = {
  // Stripe React Native web compatibility
  '@stripe/stripe-react-native': '@stripe/stripe-js',
  // Lodash optimization - use specific modules
  'lodash': 'lodash-es',
  // React Native reanimated optimization
  'react-native-reanimated/lib/reanimated2/core': 'react-native-reanimated/src/reanimated2/core',
};

// Enhanced source extensions for better platform support
config.resolver.sourceExts = [
  ...config.resolver.sourceExts, 
  'web.js', 
  'web.ts', 
  'web.tsx',
  'native.js',
  'native.ts',
  'native.tsx'
];

// Optimized asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'bin',
  'webp', // Add WebP support
  'avif', // Add AVIF support
];

// Advanced minification for production
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
  compress: {
    drop_console: process.env.NODE_ENV === 'production', // Remove console.log in production
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
  },
};

// Performance optimizations
config.transformer.enableBabelRCLookup = false;
config.transformer.hermesCommand = true; // Enable Hermes by default

// Cache configuration for faster builds
config.cacheStores = [
  {
    type: 'FileStore',
    root: require('path').join(__dirname, '.metro-cache'),
  },
];

// Memory optimization
config.maxWorkers = Math.max(1, Math.floor(require('os').cpus().length * 0.5));

// Bundle splitting configuration
config.serializer = {
  ...config.serializer,
  // Use standard serializer - custom serializer path is outdated
  getModulesRunBeforeMainModule: () => [
    require.resolve('react-native/Libraries/Core/InitializeCore'),
  ],
};

// Development optimizations
if (process.env.NODE_ENV === 'development') {
  // Faster development builds
  config.transformer.minifierPath = require.resolve('metro-minify-terser');
  config.transformer.enableBabelRCLookup = false;
  
  // Better error reporting in development
  config.resolver.hasteImplModulePath = undefined;
}

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // More aggressive optimizations for production
  config.transformer.minifierConfig.compress.sequences = true;
  config.transformer.minifierConfig.compress.dead_code = true;
  config.transformer.minifierConfig.compress.conditionals = true;
  config.transformer.minifierConfig.compress.booleans = true;
  config.transformer.minifierConfig.compress.unused = true;
  config.transformer.minifierConfig.compress.if_return = true;
  config.transformer.minifierConfig.compress.join_vars = true;
}

module.exports = config;
