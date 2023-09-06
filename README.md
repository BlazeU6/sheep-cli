# 搭建sheep-cli脚手架

## 安装
### 全局安装
$ npm install -g sheep-cli
# or yarn
$ yarn global add sheep-cli

### 借助npx
创建模版
$ npx create sheep-cli <name> [-t|--template]
示例
$ npx create sheep-cli hello-cli -template dumi2-demo

## 使用
创建模版
$ sheep-cli create <name> [-t|--template]
示例
$ sheep-cli create hello-cli -t dumi2-demo
