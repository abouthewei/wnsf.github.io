# Kobe Bryant — The Black Mamba

独立响应式科比生涯专题。React + TypeScript + Tailwind CSS + Vite。英文大标题与中文叙事；黑色、紫金色、大字号体育纪录片视觉。当前只实现科比，不包含其他球星页面或跳转。

## 运行

需要 Node.js 20+（本次环境 20.10.0）。

```sh
cd /Users/hewei/Documents/Codex/Kobe-Legacy
npm install
npm run dev
```

打开 http://127.0.0.1:5173/kobe 。根路径也会显示这张独立页面。

```sh
npm run build
npm run preview
```

生产文件输出在 `dist/`。部署到静态服务器时将 `/kobe` 回退到 `index.html`；本次已将构建后的静态页面同步到 `abouthewei/wnsf.github.io` 的 `Kobe-Legacy/` 目录。

## 页面

- Hero：Kobe / Bryant、Black Mamba、8 / 24、人物大图。
- Career Stats：5 项生涯数据，进入视口后计数动画。
- Biography：完整中文简介与人物基本信息。
- Timeline：8 个关键节点；桌面四列、手机纵向。
- Career Top 10：10 个完整时刻，4 个 NBA 官方 YouTube 视频 + 6 张注明语境的资料照片；4 种交错版式。
- Legacy：曼巴精神主题大图与原创概括，不冒充本人语录。
- Footer：纪念信息、回到顶部、可展开资料与图片署名。

## 文件结构

- `src/KobePage.tsx`：独立页面与导航。
- `src/data/kobe.ts`：统计、时间轴与 Top 10；每条记录保留资料来源。
- `src/components/Media.tsx`：响应式图片、YouTube 按需嵌入与回退入口。
- `src/components/Stats.tsx`：数据区与计数动画。
- `src/styles.css`：视觉体系与响应式布局。
- `public/images/kobe/README.md`：每张图片的作者、来源、授权和修改说明。
- `design/`：实现前的视觉参考及设计体系，参考图不会直接成为页面 UI。

图片与字体已本地化，页面无需第三方图片服务即可呈现。首屏图优先加载；下方图片懒加载；640 / 1280 图片版本配合 srcset。视频点击后才创建标准 16:9 iframe，不自动播放。无法播放时可返回本地封面或打开原视频链接。

## 核验

浏览器核验尺寸：1536×1024、1440×1024、1024×1024、768×1024、390×844、320×844。

- 所有尺寸无横向溢出、破图、标题截断与应用控制台错误。
- 手机导航打开、章节选择后关闭、锚点跳转、回到顶部通过。
- 视频按需创建 iframe、16:9 比例、autoplay=0、返回封面通过。
- 图片署名展开、减少动态效果偏好通过。
- TypeScript 与生产构建通过。

内置浏览器先验证桌面与核心操作；其 viewport override 未生效（始终 1280×720），因此额外用独立 Chromium 完成所有尺寸检查。YouTube 的实际内容播放受当前网络、地区和平台授权影响，本次验证了嵌入及回退行为，未声称已验证视频全程播放。

## 内容边界

排名是编辑精选，并非 NBA 官方排名。81 分标注为科比个人生涯最高分，不标注易变化的历史名次。资料图片均明确标注拍摄语境，不把其他比赛照片当作对应事件现场。

真实照片优先于生成设计稿中的人物姿势。Hero 基于 Keith Allison 的 2014 年照片，通过内置 Image Gen 移除背景，修改版保留 CC BY-SA 2.0 署名与授权。其余历史图片没有使用 AI 虚构比赛画面。
