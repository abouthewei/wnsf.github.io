"""Generate original procedural music for playback tests; not AI-generated songs."""
import math, wave, random
from pathlib import Path
from array import array
root=Path(__file__).resolve().parent/'audio';root.mkdir(exist_ok=True)
rate=22050
for filename,base,bpm,seed in [('morning',48,90,1),('journey',50,100,2),('night',45,75,3)]:
    rng=random.Random(seed);duration=32;count=rate*duration;mix=[0.0]*count;beat=60/bpm
    progression=[(0,4,7),(5,9,12),(9,12,16),(7,11,14)]
    def tone(midi,start,length,amplitude):
        freq=440*2**((midi-69)/12);a=int(start*rate);b=min(count,int((start+length)*rate))
        for i in range(a,b):
            t=(i-a)/rate;env=(1-math.exp(-t*30))*math.exp(-t*1.8)*min(1,(b-i)/rate*8)
            mix[i]+=amplitude*env*(math.sin(2*math.pi*freq*t)+.22*math.sin(4*math.pi*freq*t))
    for step in range(int(duration/beat)):
        chord=progression[(step//8)%4]
        if step%4==0:
            for interval in chord:tone(base+interval,step*beat,beat*4,.065)
            tone(base-12+chord[0],step*beat,beat*2,.10)
        tone(base+12+chord[step%3],step*beat,beat*1.7,.08)
    out=array('h')
    for i,v in enumerate(mix):
        fade=min(1,i/rate,(count-i)/rate/2);out.append(int(max(-.95,min(.95,v))*fade*32767))
    with wave.open(str(root/(filename+'.wav')),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(out.tobytes())
print('Generated 3 original 32-second procedural demo tracks (not AI songs).')
