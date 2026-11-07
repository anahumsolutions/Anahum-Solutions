import urllib.request
import re

html = urllib.request.urlopen('http://localhost:4173/').read().decode('utf-8')
m = re.search(r'src="(/assets/index-[^"]+\.js)"', html)
if m:
    print('Bundled JS path:', m.group(1))
    js_data = urllib.request.urlopen('http://localhost:4173' + m.group(1)).read().decode('utf-8')
    print('Bundle size:', len(js_data))
    print('Contains ScrollTrigger:', 'ScrollTrigger' in js_data)
    print('Contains initFadeUp:', 'initFadeUp' in js_data or 'fade-up' in js_data)
    print('Contains word-blur:', 'word-blur' in js_data)
