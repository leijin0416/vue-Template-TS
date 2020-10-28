import CryptoJS from 'crypto-js';

/**
 *  3DES 加解密
 */
const key = CryptoJS.enc.Utf8.parse('123456789012345678901234');
const iv = CryptoJS.enc.Utf8.parse('01234567');

export default {
    /**
     *  第二种
     *  npm install --save crypto-js
     *
     *  解密方法
     */
    Decrypt(word) {
        const decrypted = CryptoJS.TripleDES.decrypt(word,
            key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            // tslint:disable-next-line:object-literal-shorthand
            iv: iv
        });
        return CryptoJS.enc.Utf8.stringify(decrypted).toString();
    },

    // 加密方法
    Encrypt(word) {
        let words = CryptoJS.enc.Utf8.parse(word);
        const encrypted = CryptoJS.TripleDES.encrypt(words,
            key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            // tslint:disable-next-line:object-literal-shorthand
            iv: iv,
        });
        return encrypted.toString();
    }
};

