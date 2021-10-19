# Axios 前端请求处理

---

## 3DES加密

```js
CryptoJS.Encrypt(JSON.stringify(config.data));
```

### JSON 格式化数据

```js
getRealJsonData(CryptoJS.Decrypt(response.data.data));
```
