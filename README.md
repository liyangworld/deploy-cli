# deploy-this
自动化发布工具

```bash
# 安装
$ yarn global add deploy-this # 或者 npm install deploy-this -g

# 初始化配置文件
$ deploy init
$ deploy init -f # 强制覆盖已存在的 .deploy 文件夹

# 发布项目
$ deploy publish dev -m "v1.0.0 发布信息"
$ deploy p dev -m "v1.0.0 发布信息"
```