import subprocess

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--dump-dom',
    '--virtual-time-budget=2000',
    'http://localhost:4173/'
]
res = subprocess.run(cmd, capture_output=True, text=True)
matched = []
for line in res.stdout.splitlines():
    if 'style=' in line and ('transform' in line or 'opacity' in line or 'filter' in line or 'data-anim' in line):
        matched.append(line.strip())

print(f"Total matching elements with animation styles: {len(matched)}")
for m in matched[:10]:
    print("  ->", m[:100])
