import urllib.request
import re

url = "https://coverr.co/s?q=car+showroom"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    links = set(re.findall(r'https://cdn\.coverr\.co/videos/[^"]*\.mp4', html))
    for link in links:
        print(link)
except Exception as e:
    print(e)
