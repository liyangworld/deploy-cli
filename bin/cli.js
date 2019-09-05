#!/usr/bin/env node

const program = require("commander");
const deploy = require("../lib/deploy");

program
  .version(require("../package.json").version)
  .usage("<command> [options] 自动化发布项目"); //-h 打印的用户提示

let modeValue = ''
let messageValue = ''

program.option("-m, --message <message>", "执行 git commit 时的提交信息")

program
  .command('publish <mode>')
  .description('发布项目，根据配置的模式')
  .action(function (mode, options) {
    modeValue = mode
  })


program.parse(process.argv);

messageValue = program.message

if (modeValue) {
  deploy.publish(modeValue, messageValue)
}
