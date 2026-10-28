#!/usr/bin/env python3
"""Check that the source NODE release and assets are retained verbatim."""
from pathlib import Path
import json, hashlib, re
root=Path(__file__).resolve().parent
manifest=json.loads((root/'source-manifest.json').read_text())
assert not manifest['errors'],manifest['errors']
for name,record in manifest['files'].items():
    data=(root/'node'/name).read_bytes()
    if name=='index.html':data=re.sub(rb'<script src="\.\./bridge/node-adapter\.js(?:\?v=[a-zA-Z0-9-]+)?" defer></script>',b'',data,count=1)
    assert hashlib.sha256(data).hexdigest()==record['sha256'],f'Source changed or missing: {name}'
book=json.loads((root/'node/releases/20261023/data/book-data.json').read_text())
narrations=json.loads((root/'narration/manifest.json').read_text())
for n in narrations:
    original=next(m for m in book['media'] if m['id']==n['id'])
    assert original['text']==n['text']==(root/'narration'/(n['id']+'.txt')).read_text()
    wav=(root/'narration'/n['file']).read_bytes()
    assert wav[:4]==b'RIFF' and len(wav)>10000
print(f'PASS: {len(manifest["files"])} source files retained; only adapter script injected into index.')
print(f'PASS: {len(book["chapters"])} nodes, {len(book["scenes"])} scenes, {len(book["media"])} media; {len(narrations)} original-text synthetic narrations.')
