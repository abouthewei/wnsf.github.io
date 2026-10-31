# coding: utf-8
"""Generate source-grounded SVG storyboards for the feature explorer."""
import json
from pathlib import Path
from html import escape
root=Path(__file__).resolve().parents[1]
source=(root/'features/features.js').read_text()
features=json.JSONDecoder().raw_decode(source.split('const features = ',1)[1])[0]
out=root/'features/assets/journeys';out.mkdir(exist_ok=True)
def text(x,y,label,size=24,color='#e5e9df',anchor='start'):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" text-anchor="{anchor}">{escape(label)}</text>'
def rect(x,y,w,h,fill='#303d32',rx=12,stroke='#718774'):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def path(d,color='#b8d1bb',width=4):return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
def circle(x,y,r,fill='#b8d1bb'):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
def label(s):return text(180,250,s,22,'#efb583','middle')
def remote(mode='normal'):
 s=rect(128,20,104,210,'#e5e0d4',22)+rect(150,40,60,33,'#24362b',5)
 s+=circle(180,112,32,'#a4ad9b')+circle(180,112,19,'#dddccd')+text(180,119,'OK',16,'#33432f','middle')
 for x in [150,180,210]:s+=circle(x,164,9,'#afb7a5')
 s+=rect(146,190,68,17,'#b9c1ad',5)+text(155,203,'−',14,'#33432f')+text(199,203,'+',14,'#33432f')
 if mode=='scan':s+=rect(45,60,62,86,'#ece2cd',6)+text(76,103,'NFC',15,'#33432f','middle')+path('M112 70 Q130 100 112 130','#efb583')
 if mode=='ring':s+=path('M138 115 A42 42 0 1 1 214 138 M214 138 L218 122 M214 138 L200 136','#efb583',5)
 if mode=='voice':s+=rect(234,78,9,39,'#e8a065',3)+path('M264 66 Q286 94 264 122 M279 56 Q308 94 279 132')
 if mode=='volume':s+=rect(141,185,78,27,'none',8,'#e8a065')
 if mode=='power':s+=circle(180,24,10,'#e8a065')
 if mode=='charge':s+=path('M180 232 V260 H275 V215','#e8a065')+rect(260,188,30,34)
 if mode=='light':s+=text(180,64,'•••',22,'#eee8cd','middle')
 if mode=='confirm':s+=circle(180,112,23,'#e8a065')+text(180,119,'OK',16,'#33432f','middle')
 return s

def tv(mode='art'):
 s=rect(43,30,274,164,'#25342a',9)+path('M180 196 V220 M130 223 H230')
 if mode in ['art','gallery','focus','private']:
  for i in range(3):
   x=62+i*80;s+=rect(x,65,64,90,'#576954',3)+path(f'M{x+8} 139 L{x+26} 101 L{x+43} 126 L{x+55} 112','#c5cfb2',3)
  if mode=='focus':s+=rect(58,61,72,98,'none',5,'#e8a065')
 if mode=='story':
  s+=rect(61,51,102,124,'#66785e',4)
  for y in [65,88,111,134,157]:s+=path(f'M183 {y} H293','#c2cdb8',3)
 if mode in ['progress','resume']:
  s+=path('M73 147 H286','#657c62',7)+path('M73 147 H193','#e8a065',7)+circle(193,147,7,'#efb583')+text(180,111,'01:24 / 03:00',22,anchor='middle')
 if mode=='preview':s+=text(180,85,'新作品预览',24,anchor='middle')+rect(109,115,142,46,'#b8d1bb',6)+text(180,146,'确认切换',20,'#27382b','middle')
 if mode=='settings':s+=text(180,78,'设备设置',24,anchor='middle')+text(180,117,'网络   ·   配对',20,anchor='middle')+path('M90 148 H270')
 if mode=='off':s+=text(180,121,'待机',26,'#718774','middle')
 if mode=='route':
  s+=path('M90 130 L150 75 L220 130 L278 75');
  for x,y in [(90,130),(150,75),(220,130),(278,75)]:s+=circle(x,y,9,'#e8a065')
 return s

def box():return rect(68,104,224,85,'#b9bfad',15)+rect(94,139,40,16,'#293b2e',2)+rect(152,139,32,16,'#293b2e',2)+circle(264,151,4,'#52714b')
def speaker():
 s=''
 for x in [50,235]:s+=rect(x,54,75,160,'#374a39',10)+circle(x+38,152,23,'#a9bf9c')+circle(x+38,85,11,'#a9bf9c')
 return s+path('M160 85 Q190 115 160 145 M181 65 Q225 115 181 165','#e8a065')
def card():return rect(115,40,130,174,'#ded7c2',10)+text(180,119,'TimeTag',24,'#34472f','middle')+text(180,155,'NFC',18,'#34472f','middle')
def wave():
 s=rect(36,37,288,177,'#26382c',12)
 for i,h in enumerate([20,45,70,35,100,55,80,30,50,90,45,20]):s+=path(f'M{60+i*22} {125-h/2} V{125+h/2}','#b8d1bb',6)
 return s

def badge(kind):
 if kind=='check':return circle(180,116,70,'#304c36')+path('M140 117 L168 143 L224 87','#c4ddba',9)
 if kind=='pause':return circle(180,116,70,'#304c36')+rect(152,80,18,72,'#c4ddba',3)+rect(190,80,18,72,'#c4ddba',3)
 if kind=='retry':return path('M231 150 A66 66 0 1 1 224 66 M224 66 L197 66 M224 66 V39','#e8a065',8)
 if kind=='lock':return rect(124,107,112,97,'#3d5640',12)+path('M142 105 V77 A38 38 0 0 1 218 77 V105','#b8d1bb',7)+circle(180,151,8,'#e8a065')+path('M180 155 V173','#e8a065',5)
 if kind=='unknown':return circle(180,116,70,'#3f3d30')+text(180,141,'?',72,'#efb583','middle')
 if kind=='network':return path('M90 94 Q180 7 270 94 M117 125 Q180 63 243 125 M145 154 Q180 117 215 154')+circle(180,182,10)
 if kind=='cache':return rect(105,41,150,175,'#304c36',10)+path('M130 85 H228 M130 117 H228 M130 149 H200')+circle(245,204,28,'#e8a065')+path('M230 204 L241 215 L261 191','#263a2b',5)
 if kind=='usb':return path('M180 205 V60 M180 140 L126 108 V80 M180 112 L230 83 V60')+circle(126,72,10)+rect(220,40,20,20,'#b8d1bb',2)+path('M166 75 L180 50 L194 75')
 if kind=='keyboard':
  s=rect(55,75,250,125,'#3b503c',8)
  for r in range(3):
   for c in range(8):s+=rect(69+c*29,90+r*29,19,18,'#b9c9aa',2)
  return s
 if kind=='pair':return remote('normal')+path('M45 95 Q70 70 95 95 M45 127 Q70 102 95 127 M265 95 Q290 70 315 95 M265 127 Q290 102 315 127')
 return box()
scenes={
'nfc':[('remote-scan','卡背靠近读取区'),('check','一次短震 · 已读到'),('tv-art','封面返回 · 已就绪')],
'ring':[('remote-ring','逐刻度选择'),('tv-gallery','上一件 / 下一件'),('tv-progress','进度模式 · 入口未细化')],
'confirm':[('tv-focus','可见焦点 → 确认'),('tv-story','介绍渐显 / 渐隐'),('tv-gallery','返回展厅 / 主页')],
'mute':[('pause','连续导览暂停'),('pause','当前音视频暂停'),('remote-volume','独立音量键')],
'voice':[('remote-voice','按住采集 · 松开处理'),('wave','主动进入回忆录音'),('lock','预览确认 · 私有保存')],
'feedback':[('remote-light','拿起 / 按键唤醒'),('remote-scan','状态图标 + 读卡短震'),('remote-normal','约 3 秒后熄灭点阵')],
'find':[('remote-charge','USB-C 充电'),('keyboard','备用遥控器 / USB 键盘'),('tv-art','恢复基本播放')],
'power':[('remote-power','电源控制待机'),('speaker','音乐不必唤醒电视'),('tv-off','待机可唤醒 · 断电不可')],
'headless':[('tv-settings','电视引导首次设置'),('network','预装内容 / 有线网络'),('speaker','独立音频播放')],
'output':[('tv-art','HDMI 连接大屏'),('speaker','Line-out / HDMI 音响'),('remote-volume','音量与电源联动')],
'switch':[('card','入口与授权校验'),('cache','缓存优先 · 移卡继续'),('tv-preview','新卡预览 → 确认切换')],
'offline':[('cache','优先读取缓存'),('speaker','已缓存内容可离线'),('usb','授权 USB 导入')],
'library':[('tv-gallery','展厅 / 顺序阅读'),('tv-story','进入作品与介绍'),('tv-gallery','返回展厅 / 内容库')],
'resume':[('card','再次碰读作品'),('tv-resume','续接上次位置'),('tv-gallery','恢复展厅位置')],
'audio-focus':[('speaker','按作品预设播放'),('wave','讲解 / BGM / 视频'),('pause','退出会话结束声音')],
'recovery':[('retry','说明原因 · 重连重试'),('tv-art','失败保留原内容'),('check','恢复后不执行过期指令')],
'pairing':[('pair','套装出厂配对'),('tv-settings','确认盒子与配对码'),('remote-confirm','一次一位主控')],
'composition':[('tv-route','临时路线 · 不改原作'),('tv-preview','编排预览 → 确认另存'),('retry','撤销并恢复上一视图')],
'permissions':[('lock','家庭内容先授权'),('card','公共场景按授权访问'),('lock','外部网页隔离运行')]
}
def art(kind):
 if kind.startswith('remote-'):return remote(kind[7:])
 if kind.startswith('tv-'):return tv(kind[3:])
 return {'speaker':speaker,'card':card,'wave':wave}.get(kind,lambda:badge(kind))()
def wrap(label,width):
 # CJK full-width and ASCII half-width approximate line wrapping for source captions.
 lines=[];line='';n=0
 for ch in label:
  w=1 if ord(ch)>255 else .55
  if n+w>width:lines.append(line);line='';n=0
  line+=ch;n+=w
 if line:lines.append(line)
 return lines
for f in features:
 s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img" aria-labelledby="title desc"><title id="title">{escape(f["title"])}：交互路径示意</title><desc id="desc">'+escape('；'.join(a+'：'+b for a,b in f['steps']))+'</desc><rect width="1200" height="700" rx="16" fill="#1b201d"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif">'
 s+=text(32,48,f['title']+' · 交互路径',30)+text(32,81,'PDF 第 '+f['pages']+' 页 · 分步示意，非实际界面',17,'#a5b1a9')
 for i,((kind,caption),(action,response)) in enumerate(zip(scenes[f['id']],f['steps'])):
  x=24+i*394
  s+=f'<g transform="translate({x},108)">'+rect(0,0,364,566,'#222b24',12,'#3e4b40')+text(24,38,str(i+1).zfill(2),22,'#efb583')
  s+='<g transform="translate(2,38)">'+art(kind)+label(caption)+'</g>'
  for j,t in enumerate(wrap(action,13)):s+=text(22,346+j*30,t,23)
  yy=346+len(wrap(action,13))*30+12
  for j,t in enumerate(wrap(response,15)):s+=text(22,yy+j*28,t,20,'#acbbaa')
  s+='</g>'
  if i<2:s+=text(x+379,308,'→',23,'#efb583','middle')
 s+='</g></svg>'
 (out/(f['id']+'.svg')).write_text(s)
print('Generated',len(features),'journey illustrations')
