#!/usr/bin/env python3
"""Local-only demo server with byte-range support for original videos."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, re, argparse
ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        request_range = self.headers.get('Range')
        self.byte_range = None
        if request_range:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', request_range)
            if not match:
                self.send_error(416); return None
            a,b = match.groups()
            if not a and not b:
                self.send_error(416); return None
            start = int(a) if a else max(0, size-int(b))
            end = min(int(b),size-1) if a and b else size-1
            if start >= size or start > end:
                self.send_response(416); self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
            self.byte_range = (start,end)
            self.send_response(206)
            self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
            length = end-start+1
        else:
            self.send_response(200);length=size
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Length', str(length))
        self.send_header('Accept-Ranges','bytes')
        self.send_header('Cache-Control','no-cache')
        self.end_headers()
        f=open(path,'rb')
        if self.byte_range: f.seek(self.byte_range[0])
        return f
    def copyfile(self, source, outputfile):
        if not getattr(self,'byte_range',None):
            return super().copyfile(source,outputfile)
        remaining=self.byte_range[1]-self.byte_range[0]+1
        while remaining:
            data=source.read(min(65536,remaining))
            if not data:break
            outputfile.write(data);remaining-=len(data)
    def log_message(self,*args):pass
if __name__ == '__main__':
    p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8765);args=p.parse_args()
    server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    print(f'TimeEcho demo: http://127.0.0.1:{args.port}',flush=True)
    try:server.serve_forever()
    except KeyboardInterrupt:server.server_close()
