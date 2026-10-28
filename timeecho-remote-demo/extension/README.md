# TimeEcho Bilibili 浏览器扩展

扩展把演示页右侧遥控器的语义指令转交给同一标签页内嵌入的 Bilibili 整站。它只在 TimeEcho 演示地址和 `www.bilibili.com` 页面运行。

## 安装

1. 下载并解压 `timeecho-bilibili-extension.zip`。
2. 在 Chrome 打开 `chrome://extensions`，打开“开发者模式”，选择“加载已解压的扩展程序”，选中解压后的 `extension/` 文件夹。
3. 打开 [TimeEcho 视频演示](https://abouthewei.github.io/wnsf.github.io/timeecho-remote-demo/?scene=video)。保持演示页在当前标签页内，不要点“在新标签页打开”。
4. 等待右侧状态显示“Bilibili · 遥控已连接”。如果扩展刚刚加载，刷新演示页即可。

扩展只申请两个站点的访问权限：TimeEcho 演示页用于转发遥控指令，Bilibili 用于在页面中执行滚动、焦点和视频控制。它不读取账号信息，不发送页面数据到外部服务，也不自动点赞、关注、评论或分享。

## 遥控映射

- 圆环：依次选择页面链接和控件。
- 上下：页面滚动或移动控件焦点；左右：移动控件焦点。
- 确认：执行当前链接或按钮。
- 返回：清除焦点，或返回上一页。
- 首页：回到 Bilibili 首页。
- 播放/暂停、前后 5 秒、音量：控制当前页面中已加载的 HTML5 视频。若视频尚未打开，先用圆环选择视频卡片并按确认。

播放器自动播放可能受浏览器策略限制；此时先在视频上点击一次播放，再用遥控器控制。

## 文件

- `manifest.json`：MV3 配置与精确站点权限。
- `service-worker.js`：在同一标签页内连接 TimeEcho 页面和 Bilibili 页面。
- `app-bridge.js`：连接演示页与扩展。
- `bilibili-bridge.js`：将遥控操作映射到真实网页控件和视频元素。
