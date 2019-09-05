const shell = require("shelljs");
const path = require("path");
const loadConfig = require("./loadConfig");

function log(msg) {
  shell.echo("========= " + msg);
}

function callHook(hookName, configs) {
  const hook = configs[hookName];
  if (typeof hook === "string") {
    if (shell.exec(hook).code !== 0) {
      log(`执行 shell.exec(${hook}) 失败`);
      shell.exit(0);
    }
  } else if (typeof hook === "function") {
    try {
      hook(shell, configs);
    } catch (error) {
      log(`执行钩子 ${hookName} 失败：${error}`);
      shell.exit(0);
    }
  }
}

function deploy() {}

deploy.publish = function(mode, message) {
  // 检查控制台是否可以运行 `git `开头的命令
  if (!shell.which("git")) {
    log("请先安装 git 命令行工具");
    shell.exit(0);
  }

  const cwd = process.cwd();
  // 加载配置文件 .deploy/config.js
  const defaultConfigDir = ".deploy";
  let configs = {};
  try {
    configs = loadConfig(path.join(cwd, defaultConfigDir));
  } catch (error) {
    log(error.message);
    shell.exit(0);
  }

  // npm run deploy 'dev' '第一次发布'
  const commitMsg = JSON.stringify(message || '无提交信息');
  const curConfig = Object.assign({}, configs.base, configs[mode]);

  // 前置钩子
  callHook("beforeDeploy", curConfig);

  // log(`进入仓库 ${curConfig.releaseRepo}`)
  if (shell.cd(curConfig.releaseRepo).code !== 0) {
    log(`仓库 ${curConfig.releaseRepo} 不存在`);
    shell.exit(0);
  }

  if (shell.exec(`git checkout ${curConfig.branch}`).code !== 0) {
    log(`git checkout ${curConfig.branch} 失败`);
    shell.exit(0);
  }
  shell.exec(`git pull origin ${curConfig.branch}`);

  // shell.rm('-rf', '!(.git|README.md)')
  shell.rm("-rf", "!(.git)");
  shell.cp("-r", path.join(cwd, curConfig.copyFiles), "./");

  shell.exec("git add .");
  // shell.exec(`git commit -m ${commitMsg}`)
  if (shell.exec(`git commit -m ${commitMsg}`).code !== 0) {
    log("git commit 失败");
    shell.exit(0);
  }

  if (shell.exec("git push").code !== 0) {
    log("git push 失败");
    shell.exit(0);
  }

  // 后置钩子
  callHook("afterDeploy", curConfig);

  log("发布成功");
};

module.exports = deploy
