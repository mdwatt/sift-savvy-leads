#!/usr/bin/env python3
import http.server
import socketserver
import os
from functools import partial

PORT = 5000
HOST = "0.0.0.0"

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with no-cache headers to prevent stale content"""
    
    def end_headers(self):
        # Add no-cache headers to prevent browser caching
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        """Override to provide cleaner log output"""
        print(f"{self.address_string()} - {format % args}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    handler = NoCacheHTTPRequestHandler
    
    with socketserver.TCPServer((HOST, PORT), handler) as httpd:
        print(f"Server running at http://{HOST}:{PORT}/")
        print(f"Serving files from: {os.getcwd()}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
