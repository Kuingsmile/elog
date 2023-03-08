// 目前已适配图床列表
import CosClient from './cos'
import OssClient from './oss'
import UPClient from './upyun'
import GithubClient from './github'
import QiniuClient from './qiniu'
import LocalClient from './local'
import { out } from '@elog/shared'
import path from 'path'

import {
  CosConfig,
  GithubConfig,
  ImgBedEnum,
  ImgConfig,
  OssConfig,
  QiniuConfig,
  UPYunConfig,
  LocalConfig,
} from './types'
import { imageBedList } from './const'

class ImgBedClient {
  config: ImgConfig
  imageClient: any

  constructor(config: ImgConfig) {
    this.config = config
    this.imageClient = this.getImageBedInstance(this.config.bed)
  }

  /**
   * 获取图床对象的实例
   *
   * @param {string} imageBed 图床类型
   * @return {any} 图床实例
   */
  getImageBedInstance(imageBed: ImgBedEnum) {
    if (!imageBedList.includes(imageBed)) {
      out.err('配置错误', `目前只支持${imageBedList.toString()}`)
      process.exit(-1)
    }
    // 账号密码拓展点
    if (this.config.secretExt) {
      out.warning('注意', '正在使用密钥拓展点，请遵循密钥拓展点注入规范')
      try {
        // 如果指定了secret拓展点，那么拓展点返回的账号密码信息，将会覆盖elog-config.json中的image信息
        const secretExtPath = path.resolve(process.cwd(), this.config.secretExt)
        // 拓展点需要暴露getSecret方法
        const { getSecret } = require(secretExtPath)
        const secret = getSecret()
        // 拿
        this.config = { ...this.config, ...secret }
      } catch (e: any) {
        out.err(e.message)
        out.err('执行失败', '密钥拓展点执行失败，请检查！')
      }
    }
    if (imageBed === ImgBedEnum.COS) {
      const config = this.config as CosConfig
      return new CosClient(config)
    } else if (imageBed === ImgBedEnum.OSS) {
      const config = this.config as OssConfig
      return new OssClient(config)
    } else if (imageBed === ImgBedEnum.QINIU) {
      const config = this.config as QiniuConfig
      return new QiniuClient(config)
    } else if (imageBed === ImgBedEnum.UPYUN) {
      const config = this.config as UPYunConfig
      return new UPClient(config)
    } else if (imageBed === ImgBedEnum.GITHUB) {
      const config = this.config as GithubConfig
      return new GithubClient(config)
    } else if (imageBed === ImgBedEnum.LOCAL) {
      const config = this.config as LocalConfig
      return new LocalClient(config)
    } else {
      const config = this.config as LocalConfig
      return new LocalClient(config)
    }
  }

  /**
   * 检查图床是否已经存在图片，存在则返回url
   * @param fileName
   */
  async hasImage(fileName: string): Promise<string | undefined> {
    return await this.imageClient.hasImage(fileName)
  }

  /**
   * 上传图片到图床
   * @param imgBuffer
   * @param fileName
   */
  async uploadImg(imgBuffer: Buffer, fileName: string): Promise<string | undefined> {
    return await this.imageClient.uploadImg(imgBuffer, fileName)
  }
}

export default ImgBedClient
