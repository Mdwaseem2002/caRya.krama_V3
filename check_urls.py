import urllib.request

urls = [
    "https://videos.pexels.com/video-files/3802525/3802525-uhd_3840_2160_30fps.mp4",
    "https://videos.pexels.com/video-files/4056024/4056024-uhd_3840_2160_24fps.mp4",
    "https://videos.pexels.com/video-files/4056024/4056024-hd_1920_1080_24fps.mp4",
    "https://videos.pexels.com/video-files/852363/852363-hd_1280_720_24fps.mp4",
    "https://videos.pexels.com/video-files/5946371/5946371-uhd_2560_1440_30fps.mp4",
    "https://videos.pexels.com/video-files/5309381/5309381-uhd_3840_2160_25fps.mp4",
    "https://videos.pexels.com/video-files/5100053/5100053-uhd_3840_2160_25fps.mp4",
    "https://videos.pexels.com/video-files/7109276/7109276-uhd_3840_2160_25fps.mp4"
]

for url in urls:
    try:
        req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        print(f"OK: {url}")
    except Exception as e:
        print(f"ERR: {url} - {e}")
