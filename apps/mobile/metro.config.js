// apps/mobile/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");
const path = require("path");

const projectRoot   = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// 1) Load Expo’s default Metro config
const config = getDefaultConfig(projectRoot);

// 2) Tell Metro to watch the entire monorepo
config.watchFolders = [workspaceRoot];

// 3) Tweak only the resolver, merging into its existing shape:
config.resolver = {
  ...config.resolver,

  // A) blacklist any nested node_modules under your packages folder
  blockList: exclusionList([
    /.*\/packages\/.*\/node_modules\/.*/,
  ]),

  // B) look in your app’s node_modules first, then the monorepo root
  nodeModulesPaths: [
    path.join(projectRoot, "node_modules"),
    path.join(workspaceRoot, "node_modules"),
  ],

  // C) let Metro parse any extra extensions you need (e.g. cjs for Tailwind plugins)
  sourceExts: [...config.resolver.sourceExts, "cjs"],
};

module.exports = config;
