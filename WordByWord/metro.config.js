// Import getDefaultConfig function
const { getDefaultConfig } = require('expo/metro-config');

// Get defailt configuration object
const defaultConfig = getDefaultConfig(__dirname);

// Check if assetExts propert exists
if (defaultConfig.resolver.assetExts) {
    // Push 'cjs' extension to the array of assetExts
    defaultConfig.resolver.assetExts.push('cjs');
}

module.exports = defaultConfig;
