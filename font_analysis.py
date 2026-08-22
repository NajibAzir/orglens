import urllib.request, re

url = 'https://www.setel.com/PETRONAS-Shop'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print('--- INLINE/HTML FONTS ---')
    print(set(re.findall(r'font-family\s*:\s*([^;>\"\}]+)', html)))
    
    print('\n--- CSS LINKS ---')
    links = re.findall(r'<link[^>]+rel=[\'\"]stylesheet[\'\"][^>]+href=[\'\"]([^\'\"]+)[\'\"]', html)
    for l in links:
        print(l)
        
    print('\n--- CSS FONTS ---')
    for l in links:
        full_url = l if l.startswith('http') else 'https://www.setel.com' + l
        try:
            css_req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
            css = urllib.request.urlopen(css_req).read().decode('utf-8')
            print(f'From {l}:', set(re.findall(r'font-family\s*:\s*([^;\}]+)', css)))
        except Exception as e:
            print(f'Failed {l}: {e}')
except Exception as e:
    print('Error:', e)
