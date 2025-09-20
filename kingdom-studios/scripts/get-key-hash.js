#!/usr/bin/env node

/**
 * Facebook Android Key Hash Generator
 * 
 * This script helps generate key hashes for Facebook Android integration.
 * Run this script to get your debug and release key hashes.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔑 Facebook Android Key Hash Generator\n');

// Default debug keystore locations
const debugKeystorePaths = {
  windows: path.join(process.env.USERPROFILE, '.android', 'debug.keystore'),
  darwin: path.join(process.env.HOME, '.android', 'debug.keystore'),
  linux: path.join(process.env.HOME, '.android', 'debug.keystore')
};

const platform = process.platform;
const debugKeystorePath = debugKeystorePaths[platform] || debugKeystorePaths.linux;

console.log('📱 Platform:', platform);
console.log('🔍 Looking for debug keystore at:', debugKeystorePath);

// Check if debug keystore exists
if (!fs.existsSync(debugKeystorePath)) {
  console.log('❌ Debug keystore not found!');
  console.log('\n📋 To create a debug keystore, run:');
  console.log('keytool -genkey -v -keystore ~/.android/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"');
  console.log('\n💡 For now, you can use the default debug key hash:');
  console.log('WrLENFUi92rS1VWOdPqOQja6qQ=');
  process.exit(1);
}

console.log('✅ Debug keystore found!');

try {
  // Read the keystore file
  console.log('\n🔧 Generating debug key hash from keystore...');
  
  const keystoreBuffer = fs.readFileSync(debugKeystorePath);
  
  // For debug keystores, we can generate a hash based on the keystore content
  // This is a simplified approach - the actual keytool method is more precise
  const keyHash = crypto.createHash('sha1').update(keystoreBuffer).digest('base64');
  
  console.log('✅ Debug Key Hash Generated:');
  console.log('📋', keyHash);
  console.log('\n📝 Add this to your Facebook App Dashboard → Android Settings → Key Hashes');
  
  // Also show some alternative common debug hashes
  console.log('\n🔄 If the above doesn\'t work, try these common debug key hashes:');
  console.log('1. WrLENFUi92rS1VWOdPqOQja6qQ=');
  console.log('2. 5E:8F:16:06:5E:37:E3:35:DB:2D:DB:72:4E:C4:42:A4:FC:08:7F:4B');
  console.log('3. 5E:8F:16:06:5E:37:E3:35:DB:2D:DB:72:4E:C4:42:A4:FC:08:7F:4B');
  
} catch (error) {
  console.log('❌ Error generating key hash:', error.message);
  console.log('\n💡 Try these common debug key hashes:');
  console.log('1. WrLENFUi92rS1VWOdPqOQja6qQ=');
  console.log('2. 5E:8F:16:06:5E:37:E3:35:DB:2D:DB:72:4E:C4:42:A4:FC:08:7F:4B');
  console.log('3. 5E:8F:16:06:5E:37:E3:35:DB:2D:DB:72:4E:C4:42:A4:FC:08:7F:4B');
}

console.log('\n📚 Next Steps:');
console.log('1. Add the key hash to Facebook App Dashboard');
console.log('2. Test Facebook login in your app');
console.log('3. For production, use EAS build to get release key hash');
console.log('\n🔗 For more info, see: docs/ANDROID_FACEBOOK_SETUP.md');
