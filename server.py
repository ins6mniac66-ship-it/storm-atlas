import http.server
import socketserver
import subprocess
import tempfile
import json
import os
import sys
import shutil
from pathlib import Path

PORT = 5001
DEBUG_DIR = Path(__file__).parent / "output" / "scanner-debug"

class ExtractorHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/extract':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error(400, "No image data provided")
                return

            body = self.rfile.read(content_length)
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
                temp_file.write(body)
                temp_path = temp_file.name

            try:
                if DEBUG_DIR.exists():
                    shutil.rmtree(DEBUG_DIR)
                DEBUG_DIR.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(temp_path, DEBUG_DIR / "last-upload.png")

                # Run the extractor
                extractor_script = Path(__file__).parent / "ror2_run_item_extractor.py"
                
                # Use --method template for faster execution if desired, but auto is better
                result = subprocess.run(
                    [
                        sys.executable,
                        str(extractor_script),
                        temp_path,
                        "--method",
                        "auto",
                        "--debug-dir",
                        str(DEBUG_DIR),
                    ],
                    capture_output=True,
                    text=True,
                    check=False
                )
                
                if result.returncode != 0:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    error_msg = json.dumps({
                        "error": "Extraction failed",
                        "details": result.stderr,
                        "debugDir": str(DEBUG_DIR),
                    })
                    self.wfile.write(error_msg.encode('utf-8'))
                else:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(result.stdout.encode('utf-8'))
                    
            finally:
                os.remove(temp_path)
        else:
            self.send_error(404, "Endpoint not found")

with socketserver.TCPServer(("", PORT), ExtractorHandler) as httpd:
    print(f"Serving at port {PORT}")
    print(f"POST to http://localhost:{PORT}/extract to scan screenshots")
    httpd.serve_forever()
