import re
import os

files = [
    r'c:\Users\braya\Desktop\plantilla_cursos_genrenciales\plantilla_gerencial\index.php',
    r'c:\Users\braya\Desktop\plantilla_cursos_genrenciales\plantilla_gerencial\leccion\1.php'
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Look for absolute paths starting with /_next/
    matches = re.findall(r'\"/_next/static/[^\"]*\"', content)
    print(f"File: {os.path.basename(file_path)}")
    print(f"Found {len(matches)} absolute paths starting with /_next/")
    for m in matches[:5]:
        print(f"  {m}")
    print("-" * 20)
