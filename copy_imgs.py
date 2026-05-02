import shutil
import os

files = [
    (r"C:\Users\naim.wahoob\.gemini\antigravity\brain\32bad3f5-a8ff-4915-8333-8e7eb47b72b8\hero_slideshow_2_1777724446918.png", "img/hero2.png"),
    (r"C:\Users\naim.wahoob\.gemini\antigravity\brain\32bad3f5-a8ff-4915-8333-8e7eb47b72b8\hero_slideshow_3_1777724519840.png", "img/hero3.png")
]

for src, dst in files:
    try:
        shutil.copy(src, dst)
        print(f"Copied {src} to {dst}")
    except Exception as e:
        print(f"Error copying {src}: {e}")
