const COS = {
  image: {
    enable: true,
    bed: 'cos',
    bucket: '',
    region: '',
    prefixKey: 'bolg-images',
  },
}

const Github = {
  image: {
    enable: true,
    bed: 'github',
    user: '',
    repo: '',
    branch: '',
    prefixKey: 'bolg-images',
  },
}

const OSS = {
  image: {
    enable: true,
    bed: 'oss',
    bucket: '',
    region: '',
    prefixKey: 'bolg-images',
  },
}

const QiNiu = {
  image: {
    enable: true,
    bed: 'qiniu',
    user: '',
    repo: '',
    branch: '',
    token: '',
    prefixKey: 'bolg-images',
  },
}

const UPYun = {
  image: {
    enable: true,
    bed: 'upyun',
    bucket: '',
    prefixKey: 'bolg-images',
  },
}
const Local = {
  image: {
    enable: true,
    bed: 'local',
    output: '',
    pathPrefix: '',
  },
}

export const imgTemplate: any = {
  cos: COS,
  github: Github,
  oss: OSS,
  qiniu: QiNiu,
  upyun: UPYun,
  local: Local,
}
