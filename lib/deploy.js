const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const log = require("./log");
const loadConfig = require("./loadConfig");
const ora = require("ora");

const folderName = ".deploy";

function callHook(hookName, configs, params) {
  const hook = configs[hookName];
  if (typeof hook === "string") {
    if (shell.exec(hook).code !== 0) {
      log.error(`执行 shell.exec(${hook}) 失败`);
      process.exit(0);
    }
  } else if (typeof hook === "function") {
    try {
      hook(shell, configs, params);
    } catch (error) {
      log.error(`执行钩子 ${hookName} 失败：${error}`);
      process.exit(0);
    }
  }
}

function deploy() {}

deploy.init = function(isForce) {
  const cwd = process.cwd();

  const folderDir = path.join(cwd, folderName);
  const hasDeployDir = fs.existsSync(folderDir);
  if (hasDeployDir && !isForce) {
    log.warn(`配置文件夹 ${folderName} 已存在，可使用 -f 强制覆盖`);
    process.exit(0);
  } else if (!hasDeployDir) {
    fs.mkdirSync(folderDir);
  }
  // 复制配置文件夹
  const templateDir = path.resolve(__dirname, "../", folderName);
  shell.cp("-r", path.join(templateDir, "*"), folderDir);
  log.success(`初始化配置文件完成，请修改 ${folderName}/config.js 文件`);
  log.boxen('发布命令如：deploy publish dev -m "v1.0.0 发布信息"');
};

deploy.publish = function(mode, message) {
  // 检查控制台是否可以运行 `git `开头的命令
  if (!shell.which("git")) {
    log.warn("请先安装 git 命令行工具");
    process.exit(0);
  }

  const cwd = process.cwd();
  // 加载配置文件 .deploy/config.js
  let configs = {};
  try {
    configs = loadConfig(path.join(cwd, folderName));
  } catch (error) {
    log.error(error.message);
    process.exit(0);
  }

  // npm run deploy 'dev' '第一次发布'
  const commitMsg = JSON.stringify(message || "无提交信息");
  const curConfig = Object.assign({}, configs.base, configs[mode]);
  let sourceDir = curConfig.sourceDir || cwd;

  // 前置钩子
  const params = {
    commitMsg
  };
  const spinner = ora("beforeDeploy 钩子执行中...").start();
  callHook("beforeDeploy", curConfig, params);
  spinner.succeed("beforeDeploy 钩子执行完成");

  // log(`进入仓库 ${curConfig.releaseRepo}`)
  if (shell.cd(curConfig.releaseRepo).code !== 0) {
    log.error(`仓库 ${curConfig.releaseRepo} 不存在`);
    process.exit(0);
  }

  if (shell.exec(`git checkout ${curConfig.branch}`).code !== 0) {
    log.error(`git checkout ${curConfig.branch} 失败`);
    process.exit(0);
  }
  shell.exec(`git pull origin ${curConfig.branch}`);

  // shell.rm('-rf', '!(.git|README.md)')
  shell.rm("-rf", "!(.git)");
  shell.cp("-r", path.join(sourceDir, curConfig.copyFiles), "./");

  shell.exec("git add .");
  // shell.exec(`git commit -m ${commitMsg}`)
  if (shell.exec(`git commit -m ${commitMsg}`).code !== 0) {
    log.error("git commit 失败");
    process.exit(0);
  }

  if (shell.exec("git push").code !== 0) {
    log.error("git push 失败");
    process.exit(0);
  }
  shell.cd(cwd); // 返回项目目录
  // 后置钩子
  callHook("afterDeploy", curConfig, params);

  log.boxenSuccess("发布成功");
  process.exit(0);
};

module.exports = deploy;
