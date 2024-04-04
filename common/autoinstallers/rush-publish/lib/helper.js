const axios = require('axios');
const { BASE_PACKAGE } = require('./const')

/**
 * 推测下一个正式发布的版本号
 *
 * @param {*} version
 * @param {*} nextBump
 * @return {*} 
 */
function inferNextReleaseVersion({ version, nextBump }) {
  const versionParts = version.split('.');
  const nextBumpMap = {
    major: () => {
      versionParts[0]++;
      versionParts[1] = versionParts[2] = '0';
    },
    minor: () => {
      versionParts[1]++;
      versionParts[2] = '0';
    },
    patch: () => {
      versionParts[2]++;
    },
  };

  const releaseFunction = nextBumpMap[nextBump];
  if (releaseFunction) {
    releaseFunction();
  } else {
    throw new Error('Invalid release type');
  }

  return versionParts.join('.');
}

/**
 * 推导下一个预发布版本号
 *
 * @param {*} { version, preReleaseId, packageData }
 * @return {*} 
 */
function inferNextPreReleaseVersion({ version, preReleaseId, packageData }) {
  const versionPrefix = `${version}-${preReleaseId}`

  // 获取特定版本的所有beta版本号
  const versions = Object.keys(packageData.versions)
    .filter(ver => ver.startsWith(versionPrefix))


  const latestBetaCount = versions.map(ver => ver.replace(`${versionPrefix}`, '').replace(".", '') || '0')
  .map(count => parseInt(count))
  .reduce((result,count) => Math.max(result, count), 0)
    
  // 推断下一个beta版本号
  const nextBetaVersion = latestBetaCount !== undefined
    ? `${versionPrefix}.${latestBetaCount + 1}`
    : `${versionPrefix}.0`;

  return nextBetaVersion;
}

/**
 * 通过远程npm包版本信息推测下一个发布的版本号
 *
 * @param {*} params
 * @return {*} 
 */
async function getNextPublishVersionRemote(params) {
  const {
    registry = `https://registry-npm.myscrm.cn/repository/yunke/`,
    packageName = BASE_PACKAGE,
    version: _version,
    preReleaseId = 'beta',
    isPreRelease = false,
    nextBump,
  } = params

  if (!['major', 'minor', 'patch'].includes(nextBump)) {
    throw new Error('Invalid release type');
  }

  try {
    // 获取包的信息
    const registryUrl = `${registry}${packageName}`;
    const response = await axios.get(registryUrl);
    const packageData = response.data;

    const version = _version 
      ? _version.match(/\d+\.\d+\.\d+/)[0]
      : packageData['dist-tags'].latest.match(/\d+\.\d+\.\d+/)[0]

    console.log('当前线上最新稳定版本', version)

    const nextReleaseVersion = inferNextReleaseVersion({ version, nextBump })

    if (isPreRelease) {
      return inferNextPreReleaseVersion({ version: nextReleaseVersion, preReleaseId, packageData })
    }

    return nextReleaseVersion

  } catch (error) {
    throw new Error(`Failed to retrieve package information: ${error.message}`);
  }
}

module.exports = {
  getNextPublishVersionRemote
}