#基于ExpressJS, MongoDB的图片分享App

##需要什么样的环境？
* MongoDB
* NPM
* NodeJS
* Bower
* Grunt
* Git

##如何运行这个项目？

###初始化
1. 确保以下这些命令 `npm`, `mongod`, `git` 和 `bower` 在环境变量PATH中配置.
2. 在终端中执行 `git clone PROJECT_PATH`
3. 在终端中跳转到源码路径，并运行 `npm install`.
4. 运行 `bower install`.

###配置管理员
1. 在终端中运行 `mongod` 打开MongoDB服务.
2. 重新打开一个终端窗口，运行 `mongo` 打开MongoDB控制台.
3. 在控制台中依次执行如下命令 `use photo-sharing-development` `db.admins.insert({username: "admin", password: "admin"})`.

###启动项目
在终端中源码路径下运行 `npm start`

##TODO List
* 单元测试.
* 运用Grunt作自动化部署.

##License
WTFPL
