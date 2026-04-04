import os
import re

def fix_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = re.sub(r'(?i)#fe2c55', '#0059A3', content)
        new_content = re.sub(r'dark:[a-zA-Z0-9_/\-\[\]#]+', '', new_content)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {path}")
    except Exception as e:
        print(f"Error {path}: {e}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
            fix_file(os.path.join(root, file))
