## 商品后台管理系统

---

### 描述
一款通用型的管理商品的后台系统SPA应用

### 技术栈
前端：React (class component), react-router-dom v6, antd v4, axios
后台：Node, express, mongoDB

### 基本功能
- 商品分类管理
- 商品详情管理
- 用户管理
- 权限管理
- 统计图表

### 注意事项
- 请谨慎进行删除操作，最好不进行删除操作
- 由于此项目未采用react hooks，但react-router-dom版本是目前最新版本，兼容性并不好，导致编程式路由导航失效，请勿使用浏览器的前进和回退，可能会产生一些意料之外的问题
- 数据库并未上传，fork项目时会出现无数据的情况，想要参考项目demo，请点击链接

### 启动项目
- 打开my-react-admin文件夹，在终端输入
```linux
$ yarn start
```
- 打开server文件夹，在终端输入
```linux
$ node server.js
or
$ nodemon server.js 
```
