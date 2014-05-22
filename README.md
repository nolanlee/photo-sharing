# 基于ExpressJS 4.x, MongoDB的图片分享App

## 需要什么样的环境？
* [MongoDB](https://www.mongodb.org/downloads)
* [NodeJS & NPM](http://nodejs.org/)
* [Bower](http://bower.io/)
* [Grunt](http://gruntjs.com/getting-started)
* [Git](http://git-scm.com/)

## 如何运行这个项目？

### 初始化
1. 确保以下这些命令 `npm`, `mongod`, `git` 和 `bower` 在环境变量PATH中配置.
2. 在终端中执行 `git clone PROJECT_PATH`
3. 在终端中跳转到源码路径，并执行 `npm install`.
4. 执行 `bower install`.

### 配置管理员
1. 在终端中执行 `mongod` 打开MongoDB服务.
2. 重新打开一个终端窗口，执行 `mongo` 打开MongoDB控制台.
3. 在控制台中依次执行以下命令 `use photo-sharing-development` `db.admins.insert({username: "admin", password: "admin"})`.

### 启动项目
1. 在终端中源码路径下运行 `npm start`.
2. 在浏览器中访问 [localhost:3000](http://localhost:3000) 启动用户客户端.
3. 在浏览器中访问 [localhost:3000/admin](http://localhost:3000/admin) 启动管理员客户端.

## TODO List
* 单元测试.
* 运用Grunt作自动化部署.
* 改善HTTP状态码.

## License
**WTFPL**
