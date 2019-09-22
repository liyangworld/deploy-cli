// const path = require("path");
// const afterDeployJsDir = path.resolve(__dirname, "afterDeploy.js");

module.exports = {
  base: {
    releaseRepo: "../deploy-cli-release",
    copyFiles: "dist/*",
    beforeDeploy: "npm run build",
    afterDeploy: function(shell, configs, params) {
      // shell.exec(`node ${afterDeployJsDir} ${configs.branch} ${params.commitMsg}`);
    }
  },
  dev: {
    branch: "dev"
  },
  master: {
    branch: "master"
  }
};
