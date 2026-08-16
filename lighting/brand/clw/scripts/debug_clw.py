from parse_california_lightworks import parse_clw_block
import re

text = open('chat.txt', 'r', encoding='utf-8').read()
blocks = re.split(r'(?=https://)', text)
blocks = [b for b in blocks if 'californialightworks' in b]

# Manually trace the parsing
block = blocks[0]
lines = [l.strip() for l in block.strip().splitlines() if l.strip()]
lines = [l.replace('\u2013', '-').replace('\u2014', '-') for l in lines]

# Skip URL
lines = lines[1:]

known_keys = ["Installation", "Input Voltage", "Nominal Wattage", "Operating Temp",
              "Dimensions", "Weight", "LED lifetime", "Warranty", "Thermal",
              "Dimming", "Specturm", "Spectrum", "Light Output", "Efficacy",
              "Heat Output", "Safety", "Total Wattage", "Chainable", "Power Factor",
              "Frequency", "Dimension", "Fixture", "Data Connection",
              "Coverage", "Efficiency", "Power Consumption", "Auto Voltage",
              "LED Lifetime", "Certification", "Cord"]

# Find model
start_idx = 0
for i, line in enumerate(lines):
    is_key = any(line.lower().startswith(k.lower()) for k in known_keys)
    if not is_key and not line.startswith("http"):
        print(f"Model found at {i}: {repr(line)}")
        start_idx = i + 1
        break

# Parse fields
fields = {}
i = start_idx
while i < len(lines):
    key = lines[i]
    if i + 1 < len(lines):
        val = lines[i + 1]
        is_val_a_key = any(val.lower().startswith(k.lower()) for k in known_keys)
        if is_val_a_key:
            fields[key] = ""
            i += 1
        else:
            fields[key] = val
            i += 2
    else:
        fields[key] = ""
        i += 1

print("\nAll fields with 'coverage':")
for k, v in fields.items():
    if 'coverage' in k.lower():
        print(f"  {repr(k)} = {repr(v)}")

print("\nAll fields:")
for k, v in fields.items():
    print(f"  {repr(k)} = {repr(v)}")
