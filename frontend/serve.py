import http.server
import socketserver
import os
import sys

# TODO: take from env
PORT = 8000

def chdir(path):
  dir = os.path.join(os.path.dirname(__file__), path)
  print(dir)
  os.chdir(dir)

def main(args):
  chdir(args[1])
  handler = http.server.SimpleHTTPRequestHandler
  daemon = socketserver.TCPServer(('', PORT), handler)
  print('Serving statics at :{}'.format(PORT))
  daemon.serve_forever()

if __name__ == '__main__':
  sys.exit(main(sys.argv))
