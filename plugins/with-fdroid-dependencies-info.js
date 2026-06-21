const { withAppBuildGradle } = require('@expo/config-plugins');

const DEPENDENCIES_INFO_BLOCK = `    dependenciesInfo {
        includeInApk = false
        includeInBundle = false
    }
`;

function withFdroidDependenciesInfo(config) {
  return withAppBuildGradle(config, (modConfig) => {
    const contents = modConfig.modResults.contents;

    if (contents.includes('dependenciesInfo {')) {
      modConfig.modResults.contents = contents
        .replace(/includeInApk\s*=\s*true/g, 'includeInApk = false')
        .replace(/includeInBundle\s*=\s*true/g, 'includeInBundle = false');
      return modConfig;
    }

    const androidBlock = /^android\s*\{\s*$/m;
    modConfig.modResults.contents = contents.replace(
      androidBlock,
      (match) => `${match}\n${DEPENDENCIES_INFO_BLOCK}`,
    );

    return modConfig;
  });
}

module.exports = withFdroidDependenciesInfo;
