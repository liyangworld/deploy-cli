#!/usr/bin/env node

const program = require("commander");
const deploy = require("../lib/deploy");

program
  .version(require("../package.json").version)
  .usage("<command> [options] 自动化发布项目"); //-h 打印的用户提示

let commandValue = "";
let modeValue = "";
let messageValue = "";
let isForce = false;

program.option("-m, --message <message>", "执行 git commit 时的提交信息");
program.option("-f, --force", "命令是否强制执行");

program
  .command("init")
  .description("初始化发布配置")
  .action(function() {
    commandValue = "init";
  });

program
  .command("publish <mode>")
  .alias("p")
  .description("发布项目，可选择配置的模式")
  .action(function(mode, options) {
    commandValue = "publish";
    modeValue = mode;
  });

program.parse(process.argv);

messageValue = program.message;
isForce = program.force;

if (commandValue === "init") {
  deploy.init(isForce);
} else if (commandValue === "publish") {
  deploy.publish(modeValue, messageValue);
}
