'use strict';
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.resolverMainFields = [
  'sbmodern',
  'react-native',
  'browser',
  'main',
];
config.resolver.extraNodeModules = {
  '@expense-app/types': path.resolve(workspaceRoot, 'packages/types'),
};
config.resolver.disableHierarchicalLookup = true;

const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

module.exports = withNativeWind(reanimatedConfig, {
  input: './global.css',
  inlineRem: 16,
});
