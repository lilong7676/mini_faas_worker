#### 请确保已经安装 depot_tools，否则 devtools frontend 无法构建成功的哦
```
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git

# 将其添加到本机环境变量中
export PATH=$PATH:/path/to/depot_tools

# 使环境变量修改立即生效
source ~/.bash_profile

cd depot_tools
# 强制使用旧版本，否则可能会报下面的错误
git reset --hard 138bff28

# 关闭 depot_tools 的自动更新
export DEPOT_TOOLS_UPDATE=0
```


##### 执行 npm run build:font_end 时可能的报错，解决方式在上面👆：
```
> cd devtools/devtools-frontend && gn gen out/Default --args="is_debug=false" && autoninja -C out/Default && gulp copy:release

Done. Made 1810 targets from 387 files in 855ms
depot_tools/ninja.py: Could not find Ninja in the third_party of the current project, nor in your PATH.
Please take a following action to install Ninja.
- If your project has DEPS, Add a CIPD Ninja dependency to DEPS.
- Oterweise, Add Ninja to your PATH *after* depot_tools.

```
