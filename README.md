# qa-app-server

问答系统服务端，毕业设计

技术栈：typescript + inversify + express + mongoDB

## 问答系统

用户注册登录后，可创建问题，指定他人回答。创建的问题在 post 界面显示，被指定的用户登录后在 todo 界面显示。被指定用户提交问题后，问题作者可对结果进行收集分析

1. [线上地址，去看看 -> https://qa.omyleon.com](https://qa.omyleon.com)

2. [问答系统 前端 -> https://github.com/lawler61/qa-app](https://github.com/lawler61/qa-app)

3. [前端脚手架地址 -> https://github.com/lawler61/react-lighter](https://github.com/lawler61/react-lighter)

## 功能

1. 用户：登录、注册、修改基本信息、修改密码、上传头像

2. 创建问题：包括问题基本信息、具体问题、指定人员

3. 完成问题：被指定用户在规定时间内完成问题，并提交

4. 收集问题：被指定用户都作答完成后，问题作者可对问题进行收集和分析

5. 聊天：用户之间添加好友，进行简单聊天

## 运行

```bash
yarn or npm i

yarn start // for dev

yarn build && yarn server // for prod
```

## 目录结构

```markdown
└── server
    ├── bootstrap.ts // 启动文件
    ├── controllers
    │   ├── base.ts
    │   ├── department.ts
    │   ├── friend.ts
    │   ├── index.ts
    │   ├── message.ts
    │   ├── qstDetail.ts
    │   ├── question.ts
    │   ├── upload.ts
    │   └── user.ts
    ├── db
    ├── ioc
    ├── middleware
    ├── models
    │   ├── department.ts
    │   ├── friend.ts
    │   ├── message.ts
    │   ├── qstDetail.ts
    │   ├── qstReply.ts
    │   ├── question.ts
    │   └── user.ts
    ├── services
    │   ├── base.ts
    │   ├── department.ts
    │   ├── friend.ts
    │   ├── index.ts
    │   ├── message.ts
    │   ├── qstDetail.ts
    │   ├── question.ts
    │   └── user.ts
    ├── uploads // 静态文件
    ├── utils
    └── wsRouter
```
