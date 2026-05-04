import shutil
import os

src = r"C:\Users\naim.wahoob\.gemini\antigravity\brain\32bad3f5-a8ff-4915-8333-8e7eb47b72b8\placeholder_product_1777870159945.png"
dst = r"img/product-placeholder.png"

try:
    if not os.path.exists("img"):
        os.makedirs("img")
    shutil.copy(src, dst)
    print(f"Copied {src} to {dst}")
except Exception as e:
    print(f"Error copying: {e}")
