module.exports = {
  base: {
    releaseRepo: "../deploy-cli-release",
    copyFiles: "dist/*",
    beforeDeploy: 'npm run build',
    afterDeploy: function (shell, configs) {
      // shell.echo('执行 afterDeploy 成功')
    }
  },
  dev: {
    branch: "dev"
  },
  master: {
    branch: "master"
  }
};
