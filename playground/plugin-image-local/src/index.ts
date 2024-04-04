export default function myExample () {
  return {
    name: 'my-example', // 此名称将出现在警告和错误中
    transform(doc: any) {
      this.error()

    }
  };
}
