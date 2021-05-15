// import CryptoJS from 'crypto-js';
// import JSEncrypt from 'jsencrypt';

const CryptoJS = require('crypto-js');
const Encrypt = require('jsencrypt');

/**
 *  3DES 加解密
    // 加密
    let a = CryptoJS.ECBEncrypt('123456');
    console.log('加密',a);
    // 解密
    let b = CryptoJS.ECBDecrypt(a);
    console.log('解密', b);
 */
const key = CryptoJS.enc.Utf8.parse('123456789012345678901234');
const aseKey = '757da2be61249c188319a9269f1a6ccb';
const iv = '4490d2ded4f2d4ad';

// 公钥
const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDG7oB4CLgUrDcoop/dQklC/WA5VRE0SbODiknayNGsGRaBUd/rlz+2Tq9+AsRiK//JzGJqmcDxXevw/XeDiV7/3ACZLoMCX9DcXF8yS05btZBgri3yWRtYELmSAAIcNnAUdDy/4hHVSeWURSb7qsLaScoQtpe7hjcmZe5Ex/06hwIDAQAB";

const privateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALOX2k/JWgIcMyL+upKlY3nhp1y5kt1c9arM0mg1lRGBzixlzakdSYx6aYxjRzNstg4ebSAa8Hn0dHmQP3/KBlwmtF6N17o9yCd3e31N61xAFUi2VlXqSZA8gdwUraVaE7dFiypgR25XTW9n3m3HgauIY1GwfjPn3yr0gCUywggDAgMBAAECgYEApdV+vVYMSw6HGbVlyqv1o0H/LNwfBVEleEYRtDBmKfhWzSBkO9jTZWhTtlKmGJI1uevWkGLP040rUGUmfXWrUDeUqyoSeS0Xds6NGAde1qSANbKPgn2PrY9ktjsOfgueARUK5rjZixbegZYShO4Ipjpa9uaxNo02x9gIVzPDbeECQQDka4uwpZ6i5bFIvadomjtdiV9c64b+h+Fi/4S6oeWkWKwTmtxnuub58Lee+cyjmzOgVfVgMRFrFnSF8LNHPq4VAkEAyUcRtunF6w3mDoHW0xBUMVG+hu4T/Q7HiqFMz5O9TFQgWby/MPrWhSMVIuEY3zXt0TQfIwC/VhAU37G/VXH7twJASuPTzdvPMhtaz72WmJ4Qnq8+e+mgvezxAZNDAim4b/S+nkLkxoGp3wKEQXQnGvD0sTndlGciDdkz5QIw1UgArQJAe/p6vuBgONjmzCjN2lREh9yCLzqWtVlVL98LIREvmMR46M2KNvFLEdb6PfHJEDR3uFUSmMztDmX5dZBW+pqrIQJAOoVj5klsEirR408snUMPe4/2w0Uk3UH7yX+VUQa75khJGtZ2fxN1c20hwhiChV+4/kWfheIVBwFZB6Wdt5ljIQ==";

export default {
    /**
     *  第二种
     *  npm install --save crypto-js
     *
     *  解密方法
     *  https://www.jianshu.com/p/76ee794e34d6
     */
    CBCDecrypt(word) {
        const decrypted = CryptoJS.TripleDES.decrypt(word,
            key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv
        });
        return CryptoJS.enc.Utf8.stringify(decrypted).toString();
    },
    ECBDecrypt(data) {
        var key = CryptoJS.enc.Utf8.parse(aseKey);
        var ivs = CryptoJS.enc.Utf8.parse(iv);
    
        var decrypt = CryptoJS.AES.decrypt(data, key, {
            iv: ivs,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },
    RSADecrypt(txt: any) {
        const encryptor = new Encrypt.JSEncrypt();
        encryptor.setPublicKey(privateKey);
        return encryptor.decrypt(txt);
    },

    // 加密方法
    CBCEncrypt(word) {
        let words = CryptoJS.enc.Utf8.parse(word);
        const encrypted = CryptoJS.TripleDES.encrypt(words,
            key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv,
        });
        return encrypted.toString();
    },
    ECBEncrypt(data) {
        var key = CryptoJS.enc.Utf8.parse(aseKey);
        var ivs = CryptoJS.enc.Utf8.parse(iv);
        var encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: ivs,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    RSAEncrypt(txt: any) {
        const encryptor = new Encrypt.JSEncrypt();
        encryptor.setPublicKey('-----BEGIN PUBLIC KEY-----' + publicKey + '-----END PUBLIC KEY-----'); // 设置公钥
        return encryptor.encrypt(txt);    // 对需要加密的数据进行加密
    }
};

