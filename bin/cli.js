#! /usr/bin/env node
console.log('sheep-cli start ~~~')

const program = require('commander')
const inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const ora = require('ora')
const fs = require('fs-extra')
const package = require('../package.json')
const { getGitRepoList } = require('./api')

// 定义当前版本
program.version(`v${package.version}`)
program.on('--help', () => {})

program
    .command('create [projectName]')
    .description('创建模板')
    .option('-t, --template <template>', '模板名称')
    .action(async (projectName, option) => {
        // 获取模板列表
        const getTemplateLoading = ora('获取模板列表中~~~')
        getTemplateLoading.start()
        const templates = await getGitRepoList('guojiongwei')
        getTemplateLoading.succeed('获取模板列表成功 Yeah!')

        // 1、新增选择模板代码 --- 从模板列表中找到对应的模板
        const project = templates.find(template => template.name === option.template)
        
        // 2、如果匹配到了就赋值，没有就为undefined
        let projectTemplate = project ? project.value : undefined
        console.log('templates: ', project.name)
        console.log('命令行参数：', projectName === undefined ? '项目无名称' : projectName, projectTemplate === undefined ? '项目未选择模板' : projectTemplate)

        // 3、如果用户没有传入项目名称，就交互式输入
        if (!projectName) {
            const { name } = await inquirer.prompt({
                type: 'input',
                name: 'name',
                message: '请输入项目名称'
            })
            projectName = name
            console.log('项目名称： ', name)
        }
        
        // 4、如果用户没有传入项目模板，就交互式输入
        if (!projectTemplate) {
            const { template } = await inquirer.prompt({
                type: 'list',
                name: 'template',
                message: '请选择模板',
                // 模板列表
                choices: templates 
            })
            projectTemplate = template
            console.log('模板： ', template)
        }

        // 获取目标文件夹
        const dest = path.join(process.cwd(), projectName)

        // 确定是否覆盖原文件夹，如果覆盖就删除文件，如果不覆盖则退出
        if (fs.existsSync(dest)) {
            const { force } = await inquirer.prompt({
                type: 'confirm',
                name: 'force',
                message: '文件已经存在，是否覆盖？'
            })
            // 选择是y，则会删除原有文件夹，拉取新模版，如果选否(n)，则退出命令行，到这里让用户选择是否覆盖原文件夹。
            force ? fs.removeSync(dest) : process.exit(1)
            if (!force) {
                console.log('已取消操作！')
            }
        }

        // 实现下载模板
        // 定义loading
        const loading = ora('正在下载模板~~~~~~')
        // 开始loading
        loading.start()

        // 5、开始下载模板
        downloadGitRepo(projectTemplate, dest, (err) => {
            if (err) {
                loading.fail('创建模板失败！' + err.message)
            } else {
                loading.succeed('创建模板成功！')
                console.log(`\ncd ${projectName}`)
                console.log('npm i')
                console.log('npm start\n')
            }
        })
    })



program.parse(process.argv)