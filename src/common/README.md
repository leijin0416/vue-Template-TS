# Axios文档

前端请求处理

## JSON.stringify

在 `request 添加请求拦截器` 中处理前端数据发送给后端

[JSON.stringify()](https://juejin.im/post/5eee33d6e51d45742615751a)

---

## 3DES加密

```js
CryptoJS.Encrypt(JSON.stringify(config.data));
```

### JSON 格式化数据

```js
getRealJsonData(CryptoJS.Decrypt(response.data.data));
```
