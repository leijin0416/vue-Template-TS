// import CryptoJS from 'crypto-js'
// import JSEncrypt from 'jsencrypt'
const CryptoJS = require('crypto-js');
const Encrypt = require('jsencrypt');

/**
 *  3DES 加解密
    let a = CryptoJS.ECBEncrypt('123456');  // 加密
    console.log('加密',a);
    
    let b = CryptoJS.ECBDecrypt(a);  // 解密
    console.log('解密', b);
 */
const key = CryptoJS.enc.Utf8.parse('123456789012345678901234');
const aseKey = '757da2be61249c188319a9269f1a6ccb';
const iv = '4490d2ded4f2d4ad';

// 公钥
const publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKpY68gM3GvCzwgFUQyiIt1HrV6wlUXXrTCLrliaSYdTtirejaGvTgZ2JrMe60xBkLvqEPa/0/BMQKAhZpA7j20CAwEAAQ==";

const privateKey = "MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAj8YCnpci4RLkMMXQO4iRDeYaitjpiXiowzFT0IYNXP54aNVE+qAwqcQ1Un8mfflLPBuscFAi7Wuu95surTV5pQIDAQABAkASotkOE4sq35cCl3GRdfdPdOc13j4PWruNaaRyoB21UvkT++fUcMdL9XscFOo3+wM0MBn0PKoe6oJgtOzEhHDhAiEAzI4LiB2HuVi/OcO1KPgIYVjKmN+iOkpdIO9XauqKvK0CIQCz7qXSbh5pIXFByU+payTNGkZA6KA3bGcF/qR0bkgX2QIgJCjD7xbRRDlk7FAlOQ3HZXXtsmJt6gH1PnowqMy3I60CIEmx4uTPCVGRyutg4mnHYmlG66NGI+jPU1rXMtAlIw3xAiAis+cklFRKJQhpuuE2d8ARrsvGpXwPnJ1LxWzFXkYc+A==";

// 解密方法
const RSADecryptKey = (txt: any) => {
  const encryptor = new Encrypt.JSEncrypt();
  encryptor.setPublicKey(privateKey);
  return encryptor.decrypt(txt);
};

// 加密方法
const RSAEncryptKey = (txt: any) => {
  const encryptor = new Encrypt.JSEncrypt();
  encryptor.setPublicKey('-----BEGIN PUBLIC KEY-----' + publicKey + '-----END PUBLIC KEY-----'); // 设置公钥
  return encryptor.encrypt(txt);    // 对需要加密的数据进行加密
}

/**
 *  解密方法
 *  https://www.jianshu.com/p/76ee794e34d6
 */
export {
  RSADecryptKey,
  RSAEncryptKey,
}