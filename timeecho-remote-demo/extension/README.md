# TimeEcho 网页遥控扩展

Chrome MV3 扩展把 TimeEcho 右侧遥控器的操作转交给当前标签页中的搜狐或 Bilibili。网页方向键用于选择控件，转盘默认滚动页面；焦点进入播放器后，转盘调整播放进度。

当前版本为 1.2.0：网页转盘单步滚动约 42% 视口，并缩短连续转动输入间隔。已安装旧版的用户请下载并解压新版，在 `chrome://extensions` 中对扩展点“重新加载”，然后刷新演示页。

## 安装或更新

1. 下载并解压最新版 `timeecho-bilibili-extension.zip`。
2. 在 Chrome 打开 `chrome://extensions`，打开“开发者模式”，选择“加载已解压的扩展程序”，选中解压后的 `extension/` 文件夹。更新已有版本时，把新版文件覆盖到原扩展目录，再点击扩展卡片上的“重新加载”。
3. Chrome 会请求这些站点的访问权限：TimeEcho 演示页、`*.sohu.com`、`www.bilibili.com`、`player.bilibili.com`。搜狐使用通配子域名权限，是为了让官网跳转到搜狐视频页面后仍能接收遥控指令；扩展需要标记网页焦点、滚动页面并控制 HTML5 播放器。
4. 在同一个 Chrome 标签页打开 [搜狐演示](https://abouthewei.github.io/wnsf.github.io/timeecho-remote-demo/?scene=web) 或 [Bilibili 演示](https://abouthewei.github.io/wnsf.github.io/timeecho-remote-demo/?scene=video)。ChatGPT 内置浏览器不支持 Chrome 扩展。请勿点“在新标签页打开”，否则遥控器和官网不在同一标签页。
5. 等待页面显示“遥控已连接”；扩展刚加载时刷新演示页。

扩展只连接上述网页与演示页，不向外部服务发送页面数据，也不会自动点赞、关注、评论或分享。搜狐适配覆盖 `sohu.com` 及其 HTTPS 子域名。

## 遥控映射

- 四向键：在页面可见的链接、按钮、输入框和播放器控件间移动焦点。
- 确认：执行当前焦点控件。
- 转盘：普通网页中滚动页面；焦点位于播放器后，前进或回退 5 秒。
- 返回：退出播放器焦点、清除网页焦点，或返回上一页。
- 首页：回到搜狐或 Bilibili 首页。
- 播放/暂停、音量：控制当前页面中已加载的 HTML5 音视频。

播放器自动播放可能受浏览器策略限制；此时先在播放器上点击一次播放，再用遥控器控制。

## 文件

- `manifest.json`：MV3 配置与 TimeEcho、搜狐、Bilibili 的站点权限。
- `service-worker.js`：按标签页和场景转发指令，并合并 Bilibili 主页面与播放器帧的状态。
- `app-bridge.js`：连接 TimeEcho 演示页与扩展。
- `site-bridge.js`：将方向、确认、转盘和媒体操作映射到搜狐及 Bilibili 控件。
