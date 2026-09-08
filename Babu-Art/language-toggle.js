(function () {
  const translations = {
    '巴布艺术': 'Babu Art',
    '巴布艺术 Logo': 'Babu Art logo',
    '巴布艺术，返回开头': 'Babu Art, back to top',
    '章节导航': 'Section navigation',
    '切换语言': 'Switch language',
    '走进三年实践现场': 'Explore three years in the field',
    '学生在工匠指导下参与平遥古建筑修复': 'Students working with a craftsperson to restore a historic building in Pingyao',
    '章节所附学员作品': 'student work for this section',
    '巴布艺术 · 建筑遗产保护实践纪实 / 2024—2026': 'Babu Art · Architectural heritage practice journal / 2024—2026',
    '内容与活动影像依据《巴布艺术建筑遗产保护实践纪实》初稿整理，Logo 采用巴布艺术提供的版本。部分机构名称、活动日期、项目地点与联系方式沿用初稿记录，尚待项目方核实；人物姓名及完整学员名单未在本页展开。': 'This page is based on project-provided articles, images, meeting notes, and supplementary material. Names, organizations, dates, locations, image permissions, and contact details must be confirmed by the project team before publication.',
    '本页面依据项目方提供的文章、图片、会议纪要与补充材料整理。人名、机构名、日期、项目地点、图片授权及联系方式须在发布前统一核准。': 'This page is based on project-provided articles, images, meeting notes, and supplementary material. Names, organizations, dates, locations, image permissions, and contact details must be confirmed by the project team before publication.',
    '艺术 · 建筑 · 未来': 'ART · ARCHITECTURE · FUTURE',
    '为什么修复': 'Why restore',
    '三年现场': 'Three years',
    '成长的痕迹': 'Learning traces',
    '故事继续': 'The story continues',
    '实践纪实 / 2024—26': 'Practice journal / 2024—26',
    '巴布艺术 · 建筑遗产保护实践纪实': 'Babu Art · Architectural heritage practice journal',
    '修复的，': 'Restoring ',
    '不只是': 'more than ',
    '房子': 'a house',
    '从一片旧瓦，到一座古城。': 'From one old tile to an entire old city.',
    '让年轻人的双手，与历史重新相遇。': 'Let young hands meet history again.',
    '在现场，读懂时间。': 'Read time in the field.',
    '现场手记': 'FIELD NOTES',
    '山西 · 平遥': 'Shanxi · Pingyao',
    '一片瓦': 'One tile',
    '一双手': 'Two hands',
    '一座城': 'One city',
    '一种连接': 'One connection',
    '01 / 为什么修复': '01 / Why restore',
    '如果它消失，': 'If it disappears,',
    '我们会失去什么': 'what will we lose',
    '当一座老房子被重新看见，': 'When an old house is seen again,',
    '人与地方的关系也开始重建。': 'the relationship between people and place begins to rebuild.',
    '一座民居保存着材料与工艺，也保存着居住方式、邻里关系和地方经验。历史藏在旧瓦、木梁、砖缝与使用痕迹里。保护，首先是理解什么必须留下。': 'A home preserves materials and craft, but also ways of living, neighborly ties, and local knowledge. History hides in old tiles, timber beams, mortar joints, and traces of use. Restoration begins by understanding what must remain.',
    '一座民居保存着材料与工艺，也保存着居住方式、邻里关系和地方经验。历史藏在旧瓦、木梁、砖缝与使用痕迹里。保护首先是识别和判断：什么必须保留，什么需要修补，什么能够继续使用。': 'A home preserves materials and craft, but also ways of living, neighborly ties, and local knowledge. History hides in old tiles, timber beams, mortar joints, and traces of use. Restoration begins by identifying and judging what must be kept, what needs repair, and what can continue to be used.',
    '从一片瓦、一块砖、一根木构件开始，年轻人读懂气候、材料与生活，也发现：“旧”并不等于“无用”。三年的实践沿着同一条主线展开：先理解，再动手；先保存证据，再讨论未来。': 'Starting with a tile, a brick, or a timber element, young people read climate, material, and life. They discover that old does not mean useless. Across three years, one line connects the work: understand first, then act; preserve evidence first, then discuss the future.',
    '02 / 三年，三个现场': '02 / Three years, three sites',
    '把一次活动，': 'Turn one activity',
    '变成持续发生的实践。': 'into a practice that keeps unfolding.',
    '进入现场 → 理解问题 → 动手实践': 'Enter the site → understand the problem → work with your hands',
    '形成表达 → 回到公众': 'Shape an expression → share it with the public',
    '平遥 · 东泉村': 'Pingyao · Dongquan Village',
    '揭瓦 / 遛瓦 / 做土坯': 'Remove tiles / slide tiles / make adobe bricks',
    '从一片瓦开始': 'Begin with one tile',
    '平遥 · 古城': 'Pingyao · Ancient City',
    '观察 / 判断 / 精细修补': 'Observe / judge / repair precisely',
    '像牙医一样修复': 'Repair like a dentist',
    '新绛': 'Xinjiang',
    '田野 / 研究 / 创作 / 策展': 'Fieldwork / research / making / curating',
    '古城是一间工作室': 'An old city is a studio',
    '古城也是一间工作室': 'An old city is also a studio',
    '平遥东泉村 · 明代民居修复实践': 'Pingyao Dongquan Village · Ming-dynasty home restoration',
    '从一片瓦': 'From one tile',
    '开始': 'we begin',
    '五天，把双手交给泥土，': 'Five days: give your hands to the earth,',
    '把目光还给历史。': 'and your attention back to history.',
    '东泉村 / 跟随工匠，从认识构造开始': 'Dongquan Village / Follow the craftspeople and start by reading structure',
    '第一站': 'FIRST SITE',
    '来自海内外学校的初高中生与成人志愿者走进东泉村。在工匠指导下，他们拆除屋面、整理旧瓦、制作土坯。真实工地上的第一课，是尽可能保存材料、做法与使用留下的历史信息。': 'Middle and high school students and adult volunteers from schools in China and abroad entered Dongquan Village. Guided by craftspeople, they opened the roof, sorted old tiles, and made adobe bricks. The first lesson on a real site was learning to preserve as much material, technique, and evidence of use as possible.',
    '学员手绘 / 屋面构造的观察记录': 'Student drawing / Notes on roof construction',
    '现场动作 01 / 揭瓦与遛瓦': 'FIELD ACTION 01 / Removing and sliding tiles',
    '屋顶打开后，': 'Once the roof is opened,',
    '先学会保存每一片旧瓦。': 'first learn to save every old tile.',
    '椽子之上，铺着当地称为“柴”的小木条，再依次覆盖泥土、板瓦、第二层泥土与筒瓦。揭开屋面，草与泥像一片整齐的麦田；学生要从中找回旧瓦，清理、分类。': 'Above the rafters lie small wood strips known locally as “chai,” covered in layers of earth, flat tiles, more earth, and curved tiles. When opened, the roof looks like a neat field of wheat. Students recover, clean, and sort the old tiles.',
    '两根竹竿或铁管搭成滑道，底部铺厚泥土缓冲，旧瓦便能安全下运。这就是当地的“遛瓦”。': 'Two bamboo poles or iron pipes form a slide, with thick earth below as a cushion. Old tiles can travel down safely. Locally, this is called “sliding tiles.”',
    '每揭开一片瓦，': 'Every tile uncovered',
    '都像打开一个盲盒。': 'is like opening a blind box.',
    '现场动作 02 / 做土坯': 'FIELD ACTION 02 / Making adobe bricks',
    '泥土不是废料，也是建筑材料。': 'Earth is not waste. It is building material.',
    '含水量、填料均匀度、夯实力度——': 'Moisture content, even filling, and tamping force —',
    '一块简单的土坯，也有自己的分寸。': 'even a simple adobe brick has its own proportions.',
    '01 / 和泥备料，认识材料': '01 / Mix and prepare, know the material',
    '02 / 装模夯实，调整力度': '02 / Fill and tamp, adjust the force',
    '03 / 脱模晾晒，等待成形': '03 / Release and dry, wait for the form',
    '土坯来自当地最普通的泥土。从和泥、装模、夯实到脱模晾晒，学生亲手完成一块材料的诞生，也延续与原建筑相适应的传统做法。': 'The adobe bricks are made from the most ordinary local earth. From mixing and molding to tamping, releasing, and drying, students bring a material into being while continuing a traditional method suited to the original building.',
    '现场手记 / 一次意外': 'FIELD NOTE / An accident',
    '块倒下的土坯': 'adobe bricks fell',
    '块重新做好的土坯': 'adobe bricks remade',
    '道歉之后，': 'After the apology,',
    '行动才真正开始。': 'the real action began.',
    '重新做好的土坯，也是责任的形状': 'The remade bricks give responsibility a shape',
    '学生 Y 不小心碰倒了法国志愿者完成的 21 块土坯。道歉之后，他用了两天重新做好 28 块。熟练工匠一天能完成百余块，初学者却需要一次次调整泥料、模具与力度。': 'Student Y accidentally knocked over 21 adobe bricks made by a French volunteer. After apologizing, he spent two days making 28 new ones. A skilled craftsperson can make more than a hundred in a day; a beginner has to keep adjusting the earth, mold, and force.',
    '发现错误、面对后果、重新完成。责任在这里，是一件可以动手去做的事情。': 'Notice the mistake, face the consequence, and complete the work again. Here, responsibility is something you can do with your hands.',
    '观察 / 记录 / 反思': 'OBSERVE / RECORD / REFLECT',
    '手、眼睛与笔记同时工作。': 'Hands, eyes, and notes work together.',
    '从“看过”，走向可以讨论、': 'Move beyond “having seen it” toward evidence that can be',
    '比较和复盘的证据。': 'discussed, compared, and revisited.',
    '现场写生': 'Field sketch',
    '学习日记': 'Learning journal',
    '门楼速写': 'Gate sketch',
    '屋顶构造记录': 'Roof construction record',
    '劳动之外，学生用写生、测量、照片和日记记录屋顶、门楼与街巷，标注材料、构造、工具和当天的问题，也保留自己的感受。': 'Beyond the labor, students used sketches, measurements, photographs, and journals to record roofs, gates, and lanes. They marked materials, construction, tools, and questions from the day while keeping their own impressions.',
    '修复之后': 'AFTER RESTORATION',
    '房子重新站稳，': 'The house stands steady again,',
    '也等待日常回来。': 'waiting for everyday life to return.',
    '评价修复，不只看前后对比。原有材料有没有被谨慎保留？传统工艺有没有被理解和传递？空间能否重新进入生活？': 'Evaluating restoration takes more than a before-and-after comparison. Were original materials carefully kept? Was traditional craft understood and passed on? Can the space return to daily life?',
    '修复成果': 'Restoration result',
    '院落与日常': 'Courtyard and daily life',
    '保留的构造': 'Construction retained',
    '平遥古城 · 精细、克制与可复查的工作方法': 'Pingyao Ancient City · A precise, restrained, verifiable method',
    '像牙医一样，': 'Like a dentist,',
    '修复古建筑。': 'repair an old building.',
    '少一点动作，': 'Fewer actions,',
    '多一点判断。': 'more judgment.',
    '平遥古城 / 在真实修复现场学习专业方法': 'Pingyao Ancient City / Learning professional methods on a real site',
    '第二站': 'SECOND SITE',
    '第二年的实践，把注意力带到更小的尺度。面对墙基受损的砖块，学生学习先诊断、再操作。不多拆一块，不用新材料掩盖旧证据，也不放过一道不合格的工序。': 'The second year moved attention to a smaller scale. Facing damaged bricks in wall foundations, students learned to diagnose before acting. Do not remove one brick too many, cover old evidence with new material, or let an unqualified step pass.',
    '局部修补 / 把每一次干预控制在需要的位置': 'Local repair / Keep every intervention where it is needed',
    '最小干预': 'MINIMUM INTERVENTION',
    '保留健康的部分，': 'Keep the healthy parts,',
    '只处理真正的病害。': 'treat only the actual damage.',
    '像牙医一样，先检查，再诊断。在确保安全的前提下设置临时支撑、剔除受损砖、补配适合的旧砖并灌浆。': 'Like a dentist: inspect first, then diagnose. With safety secured, add temporary support, remove damaged bricks, match suitable old bricks, and grout.',
    '拆到哪里为止？材料是否相容？砂浆是否填实？每一步都需要判断，粗糙和侥幸都可能意味着重新来过。': 'Where should removal stop? Are the materials compatible? Is the mortar fully filled? Every step requires judgment; carelessness can mean starting over.',
    '观察病害': 'Observe damage',
    '临时支撑': 'Temporary support',
    '局部替换': 'Local replacement',
    '检查与重做': 'Inspect and redo',
    '专业，不是一次做对；': 'Professionalism is not getting it right once;',
    '而是知道为什么必须重做。': 'it is knowing why it must be done again.',
    '严谨是为了让每一次干预都能被解释、被复查，并对历史负责。': 'Rigor makes every intervention explainable, reviewable, and accountable to history.',
    '从现场，到自己的观察语言': 'From site to a language of observation',
    '同一座门楼，不同的目光。': 'One gate, many ways of seeing.',
    '比例、结构、材料痕迹、人的行为。': 'Proportion, structure, traces of material, and human behavior.',
    '每个人都在发展自己的表达。': 'Everyone develops a language of their own.',
    '细节观察': 'Detail observation',
    '写生中的空间': 'Space in a sketch',
    '建筑速写': 'Architectural sketch',
    '图像与文字的个人视角': 'A personal view in image and text',
    '成果 / 明信片与视觉作品': 'OUTCOME / Postcards and visual works',
    '重新编辑一次，': 'Edit it again,',
    '也就重新理解一次。': 'and understand it again.',
    '照片、草图和文字被组织成明信片与视觉作品。选择关键证据，让图像与文字相互解释，学生开始向他人说明：自己为什么在意这个地方。': 'Photographs, sketches, and words became postcards and visual works. By choosing key evidence and letting images explain the text, students began to tell others why this place matters to them.',
    '学员作品 / 用图文重新讲述现场': 'Student work / Retelling the site in image and text',
    '明信片设计 / 留下自己的观察': 'Postcard design / Leaving an observation behind',
    '新绛 · 田野 / 研究 / 创作 / 策展': 'Xinjiang · Fieldwork / research / making / curating',
    '一座古城，': 'An old city,',
    '也是一间开放的': 'also an open',
    '一间开放的': 'an open',
    '工作室。': 'studio.',
    '新绛 / 从单一建筑走向街巷与公共生活': 'Xinjiang / From one building to lanes and public life',
    '第三站': 'THIRD SITE',
    '来到新绛，实践从一栋建筑扩展到街巷、公共空间与地方文化。学生接触建筑修复、地方记忆与公共使用，再走进绘图、访谈、模型、创作和展示。': 'In Xinjiang, the practice expanded from one building to lanes, public space, and local culture. Students encountered restoration, local memory, and public use before moving into drawing, interviews, models, making, and exhibition.',
    '田野讨论 / 从现场的发现提出问题': 'Field discussion / Turn site discoveries into questions',
    '田野调查': 'FIELDWORK',
    '先进入真实语境，': 'Enter the real context first,',
    '再提出自己的问题。': 'then ask your own questions.',
    '什么值得保留？谁在使用？改变会影响谁？街巷尺度、院落关系、建筑细节与居民的使用方式，都会影响保护判断。': 'What is worth keeping? Who uses it? Who will a change affect? The scale of lanes, courtyard relationships, architectural details, and residents’ habits all shape a restoration judgment.',
    '通过直接观察、测绘、问卷与访谈，学生记录本地人的记忆，让设计回到真实生活。': 'Through direct observation, measured drawings, surveys, and interviews, students recorded local memories and brought design back to lived reality.',
    '从研究到模型': 'FROM RESEARCH TO MODEL',
    '把想法放到桌面上。': 'Put the idea on the table.',
    '从“我喜欢”，走向“为什么这样做，': 'Move from “I like it” to “why this choice,',
    '它会影响谁”。': 'and who will it affect?”',
    '绘图 / 让想法可见': 'Drawing / Make the idea visible',
    '实验 / 在讨论中修改': 'Experiment / Revise through discussion',
    '模型 / 回应真实限制': 'Model / Respond to real constraints',
    '快速草模把抽象判断变成可见的空间关系。学生解释自己的选择，也面对尺寸、材料、结构、时间与公共使用的限制，在反馈中反复修订。': 'Quick study models turn abstract judgments into visible spatial relationships. Students explain their choices, face limits of scale, material, structure, time, and public use, then revise through feedback.',
    '提出假设': 'Propose a hypothesis',
    '快速实验': 'Run a quick experiment',
    '制作模型': 'Make a model',
    '反馈与修订': 'Feedback and revision',
    '个人档案': 'PERSONAL ARCHIVE',
    '每一张过程页，': 'Every process page',
    '都在证明思考发生过。': 'proves that thinking happened.',
    '困惑、失败与修订，': 'Confusion, failure, and revision',
    '也值得被留下。': 'deserve to remain.',
    '口述访谈记录': 'Oral interview record',
    '学习日记与反思': 'Learning journal and reflection',
    '工地日记 / 图像叙事': 'Site journal / Visual narrative',
    '漫画 / 观察中的日常': 'Comics / Everyday observations',
    '日记、问卷、漫画、速写与材料测试共同组成个人档案。它们记录建筑与居民，也帮助学生回看自己的思路如何改变，让最终作品与最初的问题保持连接。': 'Journals, surveys, comics, sketches, and material tests form a personal archive. They record buildings and residents while helping students see how their thinking changed and keep the final work connected to the first question.',
    '03 / 成长的痕迹': '03 / Learning traces',
    '直到能够重新讲述，': 'Only when they can retell it',
    '实践才真正形成闭环。': 'does the practice become a full loop.',
    '学习不是一条直线。': 'Learning is not a straight line.',
    '每一次反馈，都会把我们带回现场。': 'Every round of feedback brings us back to the site.',
    '进入现场': 'Enter the site',
    '观察记录': 'Observe and record',
    '动手实践': 'Work with your hands',
    '反馈修订': 'Feedback and revise',
    '形成表达': 'Form an expression',
    '公开分享': 'Share publicly',
    '文化坐标 / 从地方走向世界': 'Cultural coordinates / From place to world',
    '能够解释一块砖、一条街、': 'To explain one brick, one street,',
    '一种工艺，也是在学习': 'or one craft is also to learn',
    '如何介绍自己的文化。': 'how to introduce your culture.',
    '在平遥，学生听取法国遗产保护志愿者联盟 REMPART 的项目分享，讨论中法木构体系的异同。跨文化理解，在使用工具、交换判断与共同承担结果的日常协作中慢慢建立。': 'In Pingyao, students heard from the French heritage volunteer alliance REMPART and discussed differences between Chinese and French timber systems. Cross-cultural understanding grew through daily collaboration: sharing tools, exchanging judgments, and sharing responsibility for the result.',
    '对地方材料、工艺与生活的深入理解，给学生具体的文化坐标。与不同背景的志愿者相遇，则让他们学会比较、翻译与沟通。从本土经验出发，与世界展开对话。': 'A close understanding of local materials, craft, and life gives students concrete cultural coordinates. Meeting volunteers from different backgrounds teaches comparison, translation, and communication. Dialogue with the world begins from local experience.',
    'REMPART 机构全称及分享者信息沿用项目初稿，待核准。': 'REMPART name and speaker details follow the draft and await confirmation.',
    '不只是参加活动，': 'They are not just attending,',
    '而是在项目中承担角色。': 'they are taking on roles in a project.',
    '现场协作': 'Site collaboration',
    '后勤与卫生协助、工地管理': 'Logistics, safety, and site management',
    '研究记录': 'Research record',
    '田野调查、摄影、访谈与测绘': 'Fieldwork, photography, interviews, and measured drawings',
    '艺术表达': 'Artistic expression',
    '绘画、模型、视觉记录与视频剪辑': 'Drawing, models, visual records, and video editing',
    '公共呈现': 'Public presentation',
    '策展协助、讲述过程、回应观众': 'Curatorial support, explaining the process, responding to visitors',
    '项目学员来自上海、深圳等地的实验学校、国际化学校及海外学习背景，覆盖中小学至大学阶段。成长也体现在如何提出问题、与他人配合、面对错误并完成表达。': 'Participants came from experimental and international schools in Shanghai, Shenzhen, and elsewhere, as well as from overseas study backgrounds, ranging from primary school to university. Growth also appears in how they ask questions, collaborate, face mistakes, and complete an expression.',
    '与国际艺术课程的连接': 'Connecting with international art courses',
    '真实语境，完整的过程证据。': 'A real context, with complete process evidence.',
    '调研 / 实验 / 反思 / 呈现': 'Research / experiment / reflection / presentation',
    '以观察记录、艺术家研究、媒材实验与个人呈现建立过程页。': 'Build process pages through observation, artist research, material experiments, and personal presentation.',
    '由一个真实问题推动持续探究，记录实践、实验与修订。': 'Let a real question drive sustained inquiry, recording practice, experiments, and revisions.',
    '把地方遗产放入跨文化语境，通过过程作品集与策展建立联系。': 'Place local heritage in a cross-cultural context through process portfolios and curation.',
    '实践为课程提供真实素材与工作方法，不替代学校课程，也不构成分数或升学结果承诺。具体要求、提交数量及学术诚信规范，以所在学校与考试局当年官方文件为准。': 'The practice provides real-world material and working methods; it does not replace school courses or promise grades or admissions results. Follow the current requirements, submission counts, and academic-integrity rules of each school and exam board.',
    '04 / 修复之后，故事继续': '04 / After restoration, the story continues',
    '日常重新发生': 'Everyday life returns',
    '一杯公益咖啡，': 'A cup of community coffee',
    '让修复空间': 'lets the restored space',
    '继续与人相遇。': 'keep meeting people.',
    '据项目方补充材料，修复后的空间在第二年继续使用，并设置公益咖啡服务：购买原料，为参与保护工作的志愿者免费提供咖啡。': 'According to supplementary project material, the restored space continued to be used in its second year and added a community coffee service: ingredients were purchased to offer free coffee to volunteers who helped with conservation.',
    '人们可以停留、交流、工作与共同照料。“修好一座房子”，由此延伸为持续的社区关系。': 'People can stay, talk, work, and care for the place together. “Repairing a house” becomes an ongoing community relationship.',
    '具体地点、启用时间与运营方式待项目方核准。': 'The location, opening date, and operating model await project confirmation.',
    '修复空间重新进入日常': 'The restored space returns to daily life',
    '给志愿者的一杯公益咖啡': 'A community coffee for volunteers',
    '05 / 从现场，到展场': '05 / From site to exhibition',
    '把过程打开，': 'Open up the process,',
    '让更多人看见。': 'let more people see it.',
    '上海 · 浦东碧云美术馆': 'Shanghai · Pudong Biyun Art Museum',
    '三年实践回顾展': 'Three-year practice retrospective',
    '根据项目方补充材料，三年的图纸、模型、日记、影像与学员作品在这里重新相遇。观众看见的不只是结果，也能沿着现场记录，理解年轻人如何观察、试验与修订。': 'According to supplementary project material, drawings, models, journals, footage, and student works from three years met again here. Visitors saw more than results; they could follow field records to understand how young people observed, tested, and revised.',
    '展览现场 / 作品与过程共同呈现': 'Exhibition / Works and process presented together',
    '从动手实践，到面对面的讲述': 'From hands-on practice to face-to-face storytelling',
    '与观众交流自己的观察': 'Sharing observations with visitors',
    '站在作品前，重新讲述自己的过程': 'Standing by the work and retelling the process',
    '策展，是最后一次重新回答：': 'Curation is the last chance to answer again:',
    '我们为什么修复？': 'Why do we restore?',
    '选择证据、组织观看顺序、回应观众的问题。个人经验离开日记本，进入公共讨论：古建筑与当代生活有什么关系？年轻人能为地方做什么？下一次行动，从哪里开始？': 'Choose evidence, organize the order of viewing, and answer visitors’ questions. Personal experience leaves the journal and enters public discussion: what is the relationship between old buildings and contemporary life? What can young people do for a place? Where does the next action begin?',
    '下一处现场，正在等待': 'The next site is waiting',
    '修复地点，': 'Restore places,',
    '重连人群': 'reconnect people',
    '把观察变成理解，': 'Turn observation into understanding,',
    '把理解变成行动。': 'and understanding into action.',
    '微信公众号': 'WeChat',
    '客服微信': 'Service WeChat',
    '联系电话': 'Phone',
    '回到开头 ↑': 'Back to top ↑',
    '巴布艺术 · 艺术建筑未来': 'Babu Art · Art, architecture, future',
    'FIELD NOTES / 现场手记': 'FIELD NOTES / FIELD JOURNAL',
    '修复 → 使用 → 分享 → 维护 ↩': 'Restore → use → share → maintain ↩'
  };

  const originals = new WeakMap();
  const attributeOriginals = new WeakMap();
  const root = document.documentElement;
  const bodyWalker = () => document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const replacementEntries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);

  function translateValue(value, language) {
    if (language !== 'en') return value;
    let translated = value;
    for (const [source, target] of replacementEntries) {
      if (source && translated.includes(source)) translated = translated.split(source).join(target);
    }
    return translated.replace(/[，。！？：；（）【】“”]/g, (mark) => ({
      '，': ',', '。': '.', '！': '!', '？': '?', '：': ':', '；': ';',
      '（': '(', '）': ')', '【': '[', '】': ']', '“': '“', '”': '”'
    }[mark] || mark));
  }

  function renderLanguage(language) {
    const walker = bodyWalker();
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement && ['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) continue;
      const original = originals.get(node) || node.nodeValue;
      originals.set(node, original);
      const key = original.trim();
      if (!key) continue;
      node.nodeValue = original.replace(key, translateValue(key, language));
    }
    document.querySelectorAll('[aria-label], [alt], [title]').forEach((element) => {
      const attrs = attributeOriginals.get(element) || {};
      for (const attribute of ['aria-label', 'alt', 'title']) {
        if (!element.hasAttribute(attribute)) continue;
        if (!attrs[attribute]) attrs[attribute] = element.getAttribute(attribute);
        element.setAttribute(attribute, translateValue(attrs[attribute], language));
      }
      attributeOriginals.set(element, attrs);
    });
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      const source = description.getAttribute('content') || '';
      const originalDescription = description.dataset.originalContent || source;
      description.dataset.originalContent = originalDescription;
      description.setAttribute('content', language === 'en'
        ? 'Babu Art architectural heritage practice journal. 2024—2026, from Pingyao to Xinjiang, from one old tile to a public exhibition.'
        : originalDescription);
    }
    root.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = language === 'en' ? 'Restoring More Than Houses · Babu Art' : '修复的，不只是房子 · 巴布艺术';
    const toggle = document.querySelector('[data-language-toggle]');
    if (toggle) {
      toggle.textContent = language === 'en' ? '中文' : 'EN';
      toggle.setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : '切换到英文');
      toggle.setAttribute('aria-pressed', String(language === 'en'));
    }
  }

  function systemLanguage() {
    return /^en(?:-|$)/i.test(navigator.language || '') ? 'en' : 'zh';
  }

  function start() {
    const toggle = document.querySelector('[data-language-toggle]');
    if (!toggle) return;
    const saved = window.localStorage.getItem('babu-art-language');
    let language = saved === 'en' || saved === 'zh' ? saved : systemLanguage();
    renderLanguage(language);
    toggle.addEventListener('click', () => {
      language = language === 'en' ? 'zh' : 'en';
      window.localStorage.setItem('babu-art-language', language);
      renderLanguage(language);
    });
  }

  // Wait until the app has hydrated before replacing text and attributes.
  // Mutating the server-rendered tree earlier would trigger a React hydration warning.
  const boot = () => window.setTimeout(start, 1500);
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
