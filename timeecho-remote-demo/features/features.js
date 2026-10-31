(() => {
  'use strict';
  const devices = {
  "remote": {
    "name": "TimeEcho Remote",
    "role": "识别、选择与语音输入",
    "image": "assets/remote-v3.jpg",
    "spec": "155 × 43 × 17 mm · 650 mAh（验证目标）",
    "baseline": [
      "NFC 上背部读取区、实体转环、四向与中心确认。",
      "返回、主页、播放暂停、独立音量键、Card、PTT 与电源。",
      "32 × 16 暖白点阵、读卡成功短震、USB-C 充电。",
      "遥控器负责语音采集、压缩与传输；盒子负责解析与处理。"
    ]
  },
  "box": {
    "name": "TimeEcho Box",
    "role": "播放、缓存、会话与计算",
    "image": "assets/box-v3.jpg",
    "spec": "108 × 108 × 28 mm · 4 GB / 32 GB（验证目标）",
    "baseline": [
      "无日常旋钮、点阵或 NFC 承托；隐蔽维护复位与微弱状态提示。",
      "HDMI 大屏输出、独立音频输出、网络、缓存与授权内容导入。",
      "NODE 全屏运行、焦点导航、语音意图与可撤销编排。",
      "套装出厂配对，支持替换遥控器与公共场景控制权。"
    ]
  }
};
  const features = [
  {
    "id": "nfc",
    "device": "remote",
    "title": "NFC 碰读",
    "pages": "6–9、11",
    "summary": "卡片碰读传递作品入口；读到卡、内容就绪与开始播放分别反馈。",
    "steps": [
      [
        "拿起遥控器或短按 Card",
        "开启约 5 秒扫描窗口，将卡背靠近上背部非金属读取区。"
      ],
      [
        "读取成功后移开卡片",
        "一次短震与小图标确认读到卡，停止重复扫描；卡片离开后会话继续。"
      ],
      [
        "等待盒子准备作品",
        "就绪后返回封面，首次自动进入；播放中读新卡先确认切换。"
      ]
    ],
    "points": [
      "读取区目标 36 × 30 mm，浅凹边界帮助定位。",
      "同卡短时间重复碰读不重启。读不到时点阵提示翻到卡背或靠近窗口，扫描结束后按 Card 重试。",
      "NFC 读取 URL / ID，不负责无线传输卡内歌曲，也不证明卡片持续在场。"
    ]
  },
  {
    "id": "ring",
    "device": "remote",
    "title": "转环操作",
    "pages": "7、10",
    "summary": "实体转环用于逐件选择；明确进入进度模式后才调整音视频进度。",
    "steps": [
      [
        "在展厅或顺序阅读中转动",
        "每个刻度移动一个焦点，快速转动做限速浏览。"
      ],
      [
        "进入作品后转动",
        "切换上一件或下一件。"
      ],
      [
        "明确进入进度模式后转动",
        "调整音视频进度。PDF 未给出进入与退出该模式的具体按键动作。"
      ]
    ],
    "points": [
      "30 mm 实体转环目标，四向与中心确认位于中央。",
      "第一版以焦点导航为主，不默认采用飞鼠。"
    ]
  },
  {
    "id": "confirm",
    "device": "remote",
    "title": "确认、返回与焦点",
    "pages": "7、10、12",
    "summary": "四向移动可见焦点，确认键根据作品或工具焦点执行动作。",
    "steps": [
      [
        "用四向选择作品并确认",
        "沿可见焦点移动，确认进入作品。"
      ],
      [
        "在作品焦点按确认",
        "介绍渐显，再按渐隐；闲置隐藏工具，方向键唤醒。"
      ],
      [
        "选择工具并确认，或按返回 / 主页",
        "工具焦点执行工具；返回上一层或展厅，主页结束当前作品并回到内容库。"
      ]
    ],
    "points": [
      "放大不切断返回路径，回展厅恢复原位置。",
      "作品内默认不显示介绍；转场约 1.2 秒为方案建议，可选减少动态。"
    ]
  },
  {
    "id": "mute",
    "device": "remote",
    "title": "播放暂停与音量",
    "pages": "7、10",
    "summary": "播放暂停与独立音量键各自承担媒体控制，不兼作展厅转动。",
    "steps": [
      [
        "连续导览时按播放暂停",
        "暂停连续导览。"
      ],
      [
        "进入音视频后按播放暂停",
        "暂停当前音视频。"
      ],
      [
        "操作独立音量键",
        "调节音量，与转环选择作品的职责分开。"
      ]
    ],
    "points": [
      "返回、主页和播放键采用不同形状，帮助盲操作。",
      "PDF 未定义独立静音键或静音快捷动作。"
    ]
  },
  {
    "id": "voice",
    "device": "remote",
    "title": "语音与回忆录音",
    "pages": "10–13、27、31",
    "summary": "按住说话、松开处理；回忆录音须主动进入录音模式，预览确认后保存。",
    "steps": [
      [
        "按住 PTT 说出命令，再松开",
        "停止输入并处理意图；“下一件 / 放大 / 暂停讲解”等直接执行，屏幕给简短反馈。"
      ],
      [
        "说“加一段我的回忆”",
        "进入明确的录音模式并提示时长，录入先进入草稿。"
      ],
      [
        "听预览并确认保存",
        "回忆归入私有纪念册；不默认上传环境谈话。"
      ]
    ],
    "points": [
      "首发不常开监听；录音灯与真实采集状态一致，云语音可关闭。",
      "私人录音默认不长期留存云端；离线保存需有加密与导出机制。",
      "PDF 未细化长录音的开始、停止按键与是否持续按住；此处不补充操作规则。"
    ]
  },
  {
    "id": "feedback",
    "device": "remote",
    "title": "点阵与读取反馈",
    "pages": "6、7、9、31、32",
    "summary": "32 × 16 暖白点阵只表达短时状态，不作为第二块内容屏。",
    "steps": [
      [
        "拿起遥控器或按键",
        "唤醒点阵，显示相应状态。"
      ],
      [
        "碰读成功或执行操作",
        "读卡成功一次短震配小图标；点阵显示碰读、加载、播放、录音、音量或电量图标。"
      ],
      [
        "查看状态后继续欣赏作品",
        "点阵默认约 3 秒后熄灭，不滚动长篇文字，不常亮显示音乐频谱。"
      ]
    ],
    "points": [
      "点阵、驱动、功耗和串光仍需工程验证。",
      "PDF 定义了读卡成功短震，未指定马达型号、失败震动次数或单独的马达成本。"
    ]
  },
  {
    "id": "find",
    "device": "remote",
    "title": "充电与备用操作",
    "pages": "6、17、32",
    "summary": "USB-C 给遥控器充电；丢失或没电时通过备用输入恢复基本播放。",
    "steps": [
      [
        "遥控器需要补充电量",
        "使用底部 USB-C 充电。"
      ],
      [
        "遥控器丢失或暂时没电",
        "使用备用已配对遥控器或 USB 键盘恢复盒子操作。"
      ],
      [
        "继续使用",
        "基本播放不永久锁定在单个遥控器上。"
      ]
    ],
    "points": [
      "650 mAh 为电池目标；需按阅读、高频碰读和课堂语音等场景实测续航。",
      "PDF 未定义主动寻找、蜂鸣定位或低电量提醒的具体交互。"
    ]
  },
  {
    "id": "power",
    "device": "remote",
    "title": "电源与待机",
    "pages": "7、10、32",
    "summary": "电源控制盒子待机，电视是否联动按配置处理。",
    "steps": [
      [
        "操作电源键",
        "盒子进入待机；电视唤醒按配置联动。"
      ],
      [
        "使用纯音乐模式",
        "不必唤醒电视。"
      ],
      [
        "盒子保持低功耗待机",
        "可接收唤醒；盒子完全断电时，蓝牙遥控不能使其开机。"
      ]
    ],
    "points": [
      "CEC 按兼容性工作，失败时由经过测试的 IR 路线兜底。",
      "顶端电源 / 可选红外为原方案配置。"
    ]
  },
  {
    "id": "headless",
    "device": "box",
    "title": "安装与无电视使用",
    "pages": "16、17",
    "summary": "日常使用不以手机为前提；纯音乐播放与电视唤醒分开。",
    "steps": [
      [
        "首次接 HDMI 与电源",
        "套装出厂配对；以太网可直接配置网络，电视引导设置 Wi-Fi。"
      ],
      [
        "准备纯音乐使用",
        "已预装内容可离线听；网络用有线或先完成设置。"
      ],
      [
        "连接音箱并碰读音乐卡",
        "独立输出音频，不暗中要求每次打开电视。"
      ]
    ],
    "points": [
      "PDF 第 17 页写明手机仅为可选辅助，并非必需步骤。",
      "盒子不默认带功率扬声器；无电视播放需要连接适用的音频设备。"
    ]
  },
  {
    "id": "output",
    "device": "box",
    "title": "音频输出与电视联动",
    "pages": "10、16",
    "summary": "HDMI 面向大屏或兼容音响，3.5 mm Line-out 面向有源音箱或功放。",
    "steps": [
      [
        "使用大屏模式",
        "HDMI 连接电视 / 显示器，内容进入 NODE 全屏运行时。"
      ],
      [
        "使用纯音乐模式",
        "3.5 mm 线性输出接有源音箱 / 功放，也可经 HDMI 输出到兼容音响。"
      ],
      [
        "使用遥控器调节音量或电源",
        "CEC 按兼容性控制电视与音响，IR 为部分设备兜底。"
      ]
    ],
    "points": [
      "声音输出与电视唤醒分开配置。",
      "电视待机后能否保留声音，由电视或音响本身决定。"
    ]
  },
  {
    "id": "switch",
    "device": "box",
    "title": "碰卡与会话切换",
    "pages": "9、11",
    "summary": "盒子验证入口、授权和内容类型，优先使用本地缓存。",
    "steps": [
      [
        "碰读卡片",
        "遥控器发送 NFC URL / ID，已配对盒子校验入口、授权与内容类型。"
      ],
      [
        "等待准备与播放",
        "有缓存则优先使用，无缓存再联网加载；卡片移开后继续播放。"
      ],
      [
        "播放中碰读另一张卡",
        "先加载预览，确认切换后渐出旧内容；同卡短时重复碰读不重启。"
      ]
    ],
    "points": [
      "新内容准备失败保留旧内容。",
      "读到卡、内容就绪和播放开始是不同状态。"
    ]
  },
  {
    "id": "offline",
    "device": "box",
    "title": "缓存与离线内容",
    "pages": "11、16、17、30",
    "summary": "离线播放依赖已缓存或经授权介质导入的内容，NFC 只定位作品。",
    "steps": [
      [
        "打开作品",
        "盒子优先读取本地缓存，无缓存时联网加载。"
      ],
      [
        "断网时使用",
        "播放已缓存或预装内容；未缓存则明确说明，不无限加载。"
      ],
      [
        "通过授权介质导入内容",
        "USB 导入桥可作为附件选项，不将内容导入表述为 NFC 传输。"
      ]
    ],
    "points": [
      "卡片只有触点 Flash 时，遥控器不能无线读取其中歌曲。",
      "PDF 未定义下载管理、固定保留、收藏或自动清理界面。"
    ]
  },
  {
    "id": "library",
    "device": "box",
    "title": "NODE 浏览与内容库",
    "pages": "10、12、23、30",
    "summary": "NODE 原生全屏运行，提供顺序阅读、空间展厅、作品进入与返回。",
    "steps": [
      [
        "在展厅或顺序阅读中浏览",
        "转环逐件选择，四向沿可见焦点移动。"
      ],
      [
        "确认进入作品",
        "默认不显示介绍；确认可渐显 / 渐隐介绍，支持局部放大。"
      ],
      [
        "返回或按主页",
        "返回展厅并恢复原位置；主页结束当前作品，回到内容库。"
      ]
    ],
    "points": [
      "一屏约 4–6 件，按实际尺寸调整；连续滑动替换作品。",
      "已有 HTML 先做顺序阅读与通用导航适配；完整遥控通过适配层逐个迁移。",
      "PDF 未给出最近播放、收藏与分类搜索的具体交互。"
    ]
  },
  {
    "id": "resume",
    "device": "box",
    "title": "续接阅读位置",
    "pages": "12、23、27",
    "summary": "再次碰读续接上次位置，返回展厅恢复原位置。",
    "steps": [
      [
        "再次碰读阅读或纪念作品",
        "打开作品并续接上次位置。"
      ],
      [
        "转环浏览、确认查看介绍",
        "按当前作品路径继续阅读。"
      ],
      [
        "返回展厅",
        "恢复展厅原位置，继续选择作品。"
      ]
    ],
    "points": [
      "卡片离开读卡区不会结束当前会话。",
      "PDF 未定义“继续 / 从头开始”选择界面，也未细化媒体进度保存范围。"
    ]
  },
  {
    "id": "audio-focus",
    "device": "box",
    "title": "声音与音频焦点",
    "pages": "11、12",
    "summary": "讲解、环境 BGM 和视频共用音频焦点及淡入淡出。",
    "steps": [
      [
        "首次碰读音乐作品",
        "按作品预设开始播放。"
      ],
      [
        "欣赏作品并控制声音",
        "环境 BGM 默认关闭，可记住偏好；音乐与讲解由观众控制。"
      ],
      [
        "退出会话",
        "同步结束视频、讲解和 BGM。"
      ]
    ],
    "points": [
      "音源之间通过统一音频焦点协调。",
      "PDF 未逐项规定讲解、BGM、视频的抢占次序和音量压低规则。"
    ]
  },
  {
    "id": "recovery",
    "device": "box",
    "title": "加载与断连恢复",
    "pages": "9、17、35",
    "summary": "异常时说明原因、保留当前内容，并提供恢复路径。",
    "steps": [
      [
        "遇到失联或卡不可达",
        "看到明确原因，可重连、重试或返回。"
      ],
      [
        "新内容准备失败",
        "保留当前内容；断网未缓存时直接说明。"
      ],
      [
        "重新连接或继续操作",
        "不将过期指令突然执行到新作品。"
      ]
    ],
    "points": [
      "验收目标包含首帧占位封面与取消入口，避免黑屏或无限旋转；这些是目标而非已验证性能。",
      "连续浏览需验证焦点不丢失，并取消过期请求。"
    ]
  },
  {
    "id": "pairing",
    "device": "box",
    "title": "配对与公共控制权",
    "pages": "17、19、25",
    "summary": "套装出厂配对，替换遥控器时在电视确认绑定。",
    "steps": [
      [
        "安装套装",
        "使用出厂配对的盒子与遥控器。"
      ],
      [
        "替换或增加遥控器",
        "在电视确认目标盒子与配对码。"
      ],
      [
        "多人或公共场景使用",
        "一次一位主控；由讲解员授予控制权，漫游卡不抢占当前讲解。"
      ]
    ],
    "points": [
      "展馆版绑定展区，设置会话超时与访客清理。",
      "课堂投票与答题留给经过配对的外设。"
    ]
  },
  {
    "id": "composition",
    "device": "box",
    "title": "语音编排与撤销",
    "pages": "11、13、30",
    "summary": "盒子解析语音意图，按作品能力生成可撤销的临时视图或编排。",
    "steps": [
      [
        "说“按时间重新看 / 只看建筑”",
        "生成临时路线，展示范围和数量，不改变原作。"
      ],
      [
        "说“把这些做成三分钟演示”",
        "复用已授权素材，提供编排预览；确认后另存版本。"
      ],
      [
        "说“撤销刚才的变化”",
        "恢复上一份视图或未发布版本，保留可回退记录。"
      ]
    ],
    "points": [
      "永久改稿、发布、删除、付费先确认；观众只改变本次会话，创作者才可写版本。",
      "越权或不支持的意图需说明；云语音可关闭，不承诺复杂 AI 全部离线。"
    ]
  },
  {
    "id": "permissions",
    "device": "box",
    "title": "授权与内容隔离",
    "pages": "21、25、27、30",
    "summary": "家庭、访客和公共展示分开管理权限，外部网页在隔离环境运行。",
    "steps": [
      [
        "首次播放私人家庭内容",
        "先完成家庭授权；客人模式不展示家庭内容库。"
      ],
      [
        "公共场景读取客户卡",
        "不自动登录私人账号，按授权访问内容。"
      ],
      [
        "打开外部或未知来源入口",
        "校验 URL 类型与跳转；未知来源先确认，受信作品按声明获取有限能力。"
      ]
    ],
    "points": [
      "外部网页不开放文件、麦克风或编辑桥接权限。",
      "敏感资料支持可撤销授权与缓存策略；离线授权有期限，撤销在下次联网同步。"
    ]
  }
];

  const $ = id => document.getElementById(id);
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function selectFeature(feature, updateUrl = true) {
    currentFeature = feature;
    selectView('paths', updateUrl);
    const device = devices[feature.device];
    const siblings = features.filter(item => item.device === feature.device);
    $('device-role').textContent = device.role;
    $('feature-title').textContent = feature.title;
    $('feature-summary').textContent = feature.summary;
    $('journey-image').src = `assets/journeys/${feature.id}.svg`;
    $('journey-image').alt = `${feature.title}交互路径：${feature.steps.map(step => step[0]).join('；')}`;
    $('journey-image-link').href = `assets/journeys/${feature.id}.svg`;
    $('journey-image-link').scrollLeft = 0;
    $('feature-number').textContent = `${String(siblings.indexOf(feature) + 1).padStart(2, '0')} / ${String(siblings.length).padStart(2, '0')}`;
    $('feature-source').textContent = `PDF 第 ${feature.pages} 页`;
    $('feature-journey').replaceChildren(...feature.steps.map(([action, response]) => {
      const step = element('li');
      step.append(element('strong', action, 'user-action'), element('p', response, 'system-response'));
      return step;
    }));
    $('feature-points').replaceChildren(...feature.points.map(point => element('li', point)));
    $('baseline-title').textContent = device.name + ' · PDF 功能概览';
    $('baseline-list').replaceChildren(...device.baseline.map(point => element('li', point)));
    const navigation = [];
    for (const [deviceId, group] of Object.entries(devices)) {
      const heading = element('h3', deviceId === 'remote' ? '遥控器' : group.name, 'feature-group-title');
      navigation.push(heading);
      features.filter(item => item.device === deviceId).forEach((item, index) => {
        const button = element('button');
        button.type = 'button';
        button.dataset.feature = item.id;
        button.setAttribute('aria-pressed', String(item.id === feature.id));
        button.append(element('span', String(index + 1).padStart(2, '0'), 'nav-number'), element('span', item.title), element('span', '→', 'nav-arrow'));
        button.onclick = () => { selectFeature(item); document.querySelector(`[data-feature="${item.id}"]`).focus({preventScroll:true}); };
        navigation.push(button);
      });
    }
    $('feature-list').replaceChildren(...navigation);
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('device', feature.device);
      url.searchParams.set('feature', feature.id);
      history.replaceState(null, '', url);
    }
  }
  const hardware = {
  "remote": [
    [
      "NFC 读取",
      "上背部独立 NFC Reader，读取 URL / 作品 ID；36 × 30 mm 非金属窗口为目标。",
      "将卡背 RF 面靠近读取区，读取后即可移开。",
      "一次短震与图标确认读取；盒子就绪后返回封面。",
      "6–9、11"
    ],
    [
      "Card 读卡键",
      "手动启动或重试扫描。",
      "短按左侧 Card 键；拿起遥控器也可开启约 5 秒扫描窗。",
      "成功后停止扫描；读不到时点阵提示翻到卡背或靠近窗口。",
      "7、9、10"
    ],
    [
      "实体转环",
      "30 mm 实体转环目标，承担逐件选择与特定模式下的进度调整。",
      "逐刻度转动；快速转动限速浏览。进入进度模式后快进，具体进入动作未定义。",
      "展厅焦点逐项移动；作品内切换上一件 / 下一件，进度模式改变播放位置。",
      "7、10"
    ],
    [
      "四向导航",
      "沿大屏可见焦点移动，不默认作为飞鼠。",
      "按上、下、左、右；工具隐藏时用方向键唤醒。",
      "焦点移动，工具重新显示。",
      "7、10、12"
    ],
    [
      "中心确认",
      "根据作品或工具焦点执行确认。",
      "在展厅确认进入作品；作品焦点确认显隐介绍，工具焦点确认执行。",
      "进入作品、介绍渐显 / 渐隐，或执行当前工具。",
      "10、12"
    ],
    [
      "返回键",
      "返回上一层，保留作品与展厅间的返回路径。",
      "按返回键退出当前层级或回到展厅。",
      "回展厅恢复原位置，放大不切断返回路径。",
      "7、10、12"
    ],
    [
      "主页键",
      "结束当前作品并进入内容库。",
      "按主页键。",
      "返回内容库；退出会话时同步结束视频、讲解和 BGM。",
      "10、11"
    ],
    [
      "播放 / 暂停键",
      "独立控制连续导览或当前音视频。",
      "按播放 / 暂停键，不兼作展厅转动。",
      "连续导览或当前音视频切换播放状态。",
      "7、10"
    ],
    [
      "音量键",
      "独立音量控制，与转环职责分开。",
      "操作音量加减；PDF 未定义独立静音键或快捷动作。",
      "调节音量，点阵显示音量状态。",
      "6、7、10"
    ],
    [
      "PTT 与麦克风",
      "橙色按住说话键，PDM 数字麦克风；首发不常开监听。",
      "按住采集、松开关闭输入；回忆需主动进入录音模式，长录音具体按键未细化。",
      "屏幕反馈意图处理；录音灯对应真实采集状态，回忆预览确认后保存。",
      "10、13、27、31"
    ],
    [
      "点阵显示",
      "32 × 16 暖白点阵，只显示短时状态。",
      "拿起或按键唤醒，默认约 3 秒后熄灭。",
      "碰读、加载、播放、录音、音量和电量图标；不滚动长篇文字。",
      "6、7、32"
    ],
    [
      "触觉反馈",
      "以短震确认 NFC 已读取，与作品就绪反馈分开。",
      "读卡成功时触发，无需额外操作。",
      "一次短震；PDF 未指定马达类型或失败震动节奏。",
      "9、11"
    ],
    [
      "电源与可选红外",
      "电源控制盒子待机，电视唤醒按配置联动；顶部可选红外。",
      "操作电源键；具体长短按时序未定义。",
      "盒子待机 / 唤醒；音乐模式不必唤醒电视，CEC 失败有受测 IR 兜底。",
      "7、10、32"
    ],
    [
      "BLE 通信与配对",
      "传输按键、转环、卡片入口及语音；自定义语音通道，不是蓝牙耳机。",
      "使用出厂配对套装；替换时在电视确认目标盒子与配对码。",
      "盒子接收事件；失联时说明原因，可重连、重试或返回。",
      "4、17、30、31"
    ],
    [
      "电池与 USB-C 充电",
      "650 mAh 电池为目标，底部 USB-C 用于充电。",
      "接 USB-C 充电；没电或丢失时用备用遥控器或 USB 键盘恢复操作。",
      "点阵可显示电量；具体充电灯效、阈值及续航天数未定义。",
      "6、7、17、32"
    ]
  ],
  "box": [
    [
      "USB-C 供电与待机",
      "盒子持续供电，低功耗待机接收唤醒。",
      "首次接入电源；通过遥控器控制待机。",
      "待机可接收唤醒；完全断电时无法由蓝牙遥控开机。",
      "15、17、32"
    ],
    [
      "HDMI 输出",
      "连接电视 / 显示器或兼容音响，承载图像与声音。",
      "连接 HDMI，进入大屏模式；也可用于兼容音响输出。",
      "NODE 全屏呈现作品或输出音频；热插拔与设备兼容性需验证。",
      "15、16、31"
    ],
    [
      "CEC 与 IR 联动",
      "CEC 优先控制兼容电视与音响，IR 为部分设备兜底。",
      "按配置使用遥控器的电源与音量操作。",
      "电视唤醒、音量按兼容路径联动；音乐模式不默认开电视。",
      "10、15、16"
    ],
    [
      "3.5 mm Line-out",
      "独立线性音频输出；盒子不默认带功率扬声器。",
      "接有源音箱或功放，碰读音乐卡。",
      "独立播放音乐；电视待机后的 HDMI 声音取决于电视 / 音响。",
      "15、16"
    ],
    [
      "Ethernet 有线网络",
      "通过网线配置网络、获取作品包或预装内容。",
      "连接 Ethernet；首次安装可直接配置网络。",
      "联网加载内容；未缓存且断网时明确提示缺少内容。",
      "15、17、25"
    ],
    [
      "Wi-Fi 无线网络",
      "获取作品内容，与 BLE 遥控通信职责分开。",
      "首次在电视引导下设置 Wi-Fi；PDF 将手机列为可选辅助。",
      "网络可用时加载作品；设置过程的具体提示样式未定义。",
      "15、17"
    ],
    [
      "BLE 接收与配对",
      "接收遥控事件和语音，支持替换 / 多遥控器管理。",
      "套装出厂配对；电视上确认目标盒子和配对码。",
      "一次一位主控；公共场景由讲解员授予控制权。",
      "15、17、30"
    ],
    [
      "USB-A 与外接输入",
      "连接 USB 外设，支持备用键盘恢复操作及授权内容导入路径。",
      "遥控器不可用时接 USB 键盘；内容按授权通过 USB 预装 / 导入。",
      "恢复基本操作或提供本地内容；可选导入桥不等同 NFC 传输。",
      "15–17、25"
    ],
    [
      "计算、存储与播放",
      "RK3566 级 Linux 路线，4 GB RAM / 32 GB 存储目标；承担渲染、解码和缓存。",
      "碰读后校验入口、授权和类型，优先用缓存，无缓存再联网加载。",
      "呈现作品 / 播放媒体；4K 解码不代表复杂 3D 稳定 4K60。",
      "11、12、15、30、31"
    ],
    [
      "维护复位",
      "机身保留隐蔽维护复位，不设置日常旋钮、点阵或 NFC 承托。",
      "维护时使用复位入口；按压方式与时间未定义。",
      "PDF 未定义复位提示、数据保留范围及恢复步骤。",
      "15"
    ],
    [
      "机身状态提示",
      "保留微弱状态提示，日常操作集中在遥控器。",
      "设备运行时提供提示，具体触发条件未定义。",
      "亮度、颜色与闪烁规则未定义。",
      "15"
    ],
    [
      "散热与无线结构",
      "PC 上盖为无线天线留空间；散热片、导热垫与金属底座独立热设计。",
      "正常运行，无需用户额外操作。",
      "被动散热；长时温升需验证，原文未定义过热告警交互。",
      "15、31"
    ]
  ]
};
  let currentFeature;
  function selectView(view, updateUrl = true) {
    const table = view === 'table';
    $('device-panel').hidden = table;
    $('feature-table').hidden = !table;
    document.querySelectorAll('[role="tab"]').forEach(tab => {
      const active = tab.dataset.view === view;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (!table) $('device-panel').setAttribute('aria-labelledby', 'tab-paths');
    $('device-role').textContent = table ? '遥控器与盒子 · 硬件功能' : devices[currentFeature.device].role;
    if (updateUrl) {
      const url = new URL(location.href);
      if (table) url.searchParams.set('view', 'table');
      else url.searchParams.delete('view');
      url.hash = '';
      history.replaceState(null, '', url);
    }
  }
  function renderFeatureTable() {
    for (const [device, rows] of Object.entries(hardware)) {
      const section = element('section', undefined, 'hardware-group');
      const heading = element('h3', devices[device].name);
      heading.id = 'hardware-' + device;
      const scroll = element('div', undefined, 'feature-table-scroll');
      scroll.tabIndex = 0;
      scroll.setAttribute('role', 'region');
      scroll.setAttribute('aria-labelledby', heading.id);
      const table = element('table', undefined, 'feature-table');
      table.append(element('caption', devices[device].name + ' 硬件功能总表', 'sr-only'));
      const head = element('thead');
      const header = element('tr');
      ['功能', '功能定义', '操作', '反馈'].forEach(label => {
        const cell = element('th', label); cell.scope = 'col'; header.append(cell);
      });
      head.append(header);
      const body = element('tbody');
      rows.forEach(([name, definition, action, feedback, pages]) => {
        const row = element('tr');
        const label = element('th'); label.scope = 'row';
        label.append(element('strong', name), element('small', 'PDF 第 ' + pages + ' 页'));
        row.append(label, element('td', definition), element('td', action), element('td', feedback));
        body.append(row);
      });
      table.append(head, body); scroll.append(table);
      const figure = element('figure', undefined, 'hardware-diagram');
      const link = element('a');
      const image = element('img');
      const diagram = device === 'remote' ? 'remote-controls.svg' : 'box-interfaces.svg';
      link.href = 'assets/' + diagram;
      link.target = '_blank'; link.rel = 'noopener';
      image.src = link.href;
      image.alt = device === 'remote' ? '遥控器正面按键与背部 NFC 标注图：点阵、转环、四向与确认、音量键、Card、PTT、电源和 USB-C' : '盒子后部接口标注图：HDMI、Ethernet、USB-C 电源、USB-A 和 3.5 mm Line-out，以及无线、计算和散热职责';
      image.width = 1200; image.height = 680;
      link.append(image);
      figure.append(link, element('figcaption', '依据 PDF 绘制的功能示意，非工程图。点击图片可放大查看。'));
      section.append(heading, figure, scroll);
      $('hardware-tables').append(section);
    }
  }
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab, index) => {
    tab.onclick = () => {
      if (tab.dataset.view === 'table') selectView('table');
      else selectFeature(currentFeature || features[0]);
    };
    tab.onkeydown = event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); tabs[next].focus(); tabs[next].click();
    };
  });
  const params = new URLSearchParams(location.search);
  const selected = features.find(item => item.id === params.get('feature')) || features.find(item => item.device === params.get('device')) || features[0];
  if (location.hash === '#comparison') {
    const url = new URL(location.href); url.hash = ''; history.replaceState(null, '', url);
  }
  const showTable = params.get('view') === 'table' || location.hash === '#feature-table';
  selectFeature(selected, false);
  renderFeatureTable();
  if (showTable) selectView('table', false);
})();
