import urllib.request, re

url = 'https://www.setel.com/PETRONAS-Shop'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print('--- CSS VARIABLES & CLASSES ---')
    print('Root style variables:', re.findall(r'--font-[^:]+:\s*([^;\"\']+)', html))
    print('Class names with font:', set(re.findall(r'class=[\'\"]([^\'\"]*font-[^\'\"]*)[\'\"]', html)))
except Exception as e:
    print('Error:', e)
