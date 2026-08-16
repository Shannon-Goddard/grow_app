import http.server
import socketserver
import sys

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        if self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json')
        super().end_headers()

def find_free_port(start_port=8000):
    for port in range(start_port, start_port + 100):
        try:
            with socketserver.TCPServer(("", port), None) as test_server:
                return port
        except OSError:
            continue
    return None

try:
    PORT = find_free_port()
    if PORT is None:
        print("No available ports found")
        sys.exit(1)
    
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped")
except Exception as e:
    print(f"Server error: {e}")