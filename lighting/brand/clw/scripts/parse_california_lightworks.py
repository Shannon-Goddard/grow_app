import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_clw_block(block):
    """Parse a single California Lightworks product block."""
    data = {}

    data["dba"] = "California Lightworks"
    data["make"] = "California Lightworks"

    lines = [l.strip() for l in block.strip().splitlines() if l.strip()]

    # Normalize en-dashes and curly quotes to ASCII
    lines = [l.replace('\u2013', '-').replace('\u2014', '-').replace('\u2018', "'").replace('\u2019', "'").replace('\u201c', '"').replace('\u201d', '"') for l in lines]

    # URL is first line
    url = ""
    if lines and lines[0].startswith("http"):
        url = lines[0]
        lines = lines[1:]
    data["pdf"] = url

    # Model is typically the next line (e.g. "MegaDrive® Linear")
    # Skip if it looks like a key (has a known keyword)
    known_keys = ["Installation", "Input Voltage", "Nominal Wattage", "Operating Temp",
                  "Dimensions", "Weight", "LED lifetime", "Warranty", "Thermal",
                  "Dimming", "Specturm", "Spectrum", "Light Output", "Efficacy",
                  "Heat Output", "Safety", "Total Wattage", "Chainable", "Power Factor",
                  "Frequency", "Dimension", "Fixture", "Data Connection",
                  "Coverage", "Efficiency", "Power Consumption", "Auto Voltage",
                  "LED Lifetime", "Certification", "Cord"]
    
    model = ""
    start_idx = 0
    for i, line in enumerate(lines):
        is_key = any(line.startswith(k) for k in known_keys)
        if not is_key and not line.startswith("http"):
            model = line
            start_idx = i + 1
            break

    data["model"] = model
    if not model:
        return None  # Skip blocks without a model (like power supply specs)

    # Parse remaining lines as key-value pairs
    # Lines alternate: key, then value on next line
    fields = {}
    i = start_idx
    while i < len(lines):
        key = lines[i]
        # Look ahead for value
        if i + 1 < len(lines):
            val = lines[i + 1]
            # If val also looks like a known key, this key has no value - skip
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

    # Type
    data["type"] = "LED"

    # PPF
    ppf = ""
    for k, v in fields.items():
        if "light output" in k.lower() or "ppf" in k.lower():
            ppf = v
            break
    m = re.search(r"([\d,]+)", ppf)
    data["PPF"] = m.group(1).replace(",", "") if m else ""

    # Efficacy - "3.93 µMoles/J" or "2.51 µmol/J"
    eff = fields.get("Efficacy (Up to)", "") or fields.get("Efficiency", "")
    m = re.search(r"([\d.]+)", eff)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Power - "400W" or "0 – 800 W" or just "800"
    wattage = fields.get("Nominal Wattage", "") or fields.get("Power Consumption", "")
    # Get the last/max number
    nums = re.findall(r"(\d+)", wattage)
    data["max_Watts"] = nums[-1] if nums else ""

    # Voltage - "<20 VDC" or "90 – 277 V"
    voltage = fields.get("Input Voltage", "") or fields.get("Auto Voltage", "")
    m = re.search(r"(\d+)\s*[-\u2013]\s*(\d+)", voltage)
    if m:
        data["VAC_low"] = m.group(1)
        data["VAC_high"] = m.group(2)
    else:
        data["VAC_low"] = data["VAC_high"] = ""

    # Frequency
    freq = fields.get("Frequency", "")
    m = re.search(r"(\d+)\s*[-/\u2013]\s*(\d+)", freq)
    if m:
        data["Hz_low"] = m.group(1)
        data["Hz_high"] = m.group(2)
    else:
        data["Hz_low"] = data["Hz_high"] = ""

    # Dimensions
    dims = fields.get("Dimensions", "") or fields.get("Dimension", "")
    dims = dims.replace("\u201c", '"').replace("\u201d", '"')
    m = re.search(r'([\d.]+)[\x22\x27\s]*[xX]\s*([\d.]+)[\x22\x27\s]*[xX]\s*([\d.]+)', dims)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Weight - "10 LBS"
    weight = fields.get("Weight", "")
    m = re.search(r"([\d.]+)", weight)
    data["weight_lb"] = m.group(1) if m else ""

    # Lifespan - ">100,000 Hrs" or "50,000+"
    life = fields.get("LED lifetime Rating L90", "") or fields.get("LED Lifetime Rating", "") or fields.get("LED lifetime Rating", "")
    m = re.search(r"([\d,]+)", life)
    data["lifespan_hours"] = m.group(1).replace(",", "") if m else ""

    # Warranty
    warranty = fields.get("Warranty", "") or fields.get("Warranlty", "") or fields.get("Warranty ", "")
    m = re.search(r"(\d+)", warranty)
    data["Warranty_years"] = m.group(1) if m else ""

    # Thermal Management
    data["Thermal Management"] = fields.get("Thermal Management", "")

    # Dimming
    dimming = fields.get("Dimming", "")
    if dimming:
        data["dimmable"] = "TRUE"
        data["Dimming Options"] = dimming
    else:
        data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

    # Operating Temp - "0-40°C (32-107°F)"
    op_temp = fields.get("Operating Temp", "")
    m = re.search(r"(\d+)\s*°?\s*C.*?(\d+)\s*°?\s*F", op_temp)
    if m:
        data["max_ambient_temperature_c"] = m.group(1)
        data["max_ambient_temperature_f"] = m.group(2)
    else:
        data["max_ambient_temperature_c"] = data["max_ambient_temperature_f"] = ""

    # Certifications
    data["Certifications"] = fields.get("Safety Compliance", "") or fields.get("Safety Certification", "") or fields.get("Certification", "")

    # Coverage - Bloom and Veg
    bloom = ""
    veg = ""
    for k, v in fields.items():
        if "coverage" in k.lower() and "bloom" in k.lower():
            bloom = v
        elif "coverage" in k.lower() and "veg" in k.lower():
            veg = v
    m = re.search(r"([\d.]+)['\'\"\s]*[xX]\s*([\d.]+)", bloom)
    if m:
        data["flowering_footprint_length_ft"] = m.group(1)
        data["flowering_footprint_width_ft"] = m.group(2)
    else:
        data["flowering_footprint_length_ft"] = data["flowering_footprint_width_ft"] = ""

    m = re.search(r"([\d.]+)['\'\"\s]*[xX]\s*([\d.]+)", veg)
    if m:
        data["veg_footprint_length_ft"] = m.group(1)
        data["veg_footprint_width_ft"] = m.group(2)
    else:
        data["veg_footprint_length_ft"] = data["veg_footprint_width_ft"] = ""
    data["flowering_mounting_height_min_inches"] = ""
    data["flowering_mounting_height_max_inches"] = ""
    data["veg_mounting_height_min_inches"] = ""
    data["veg_mounting_height_max_inches"] = ""
    data["propagation_mounting_height_min_inches"] = ""
    data["propagation_mounting_height_max_inches"] = ""
    data["propagation_intensity_pct_min"] = ""
    data["propagation_intensity_pct_max"] = ""
    data["veg_intensity_pct_min"] = ""
    data["veg_intensity_pct_max"] = ""
    data["flower_intensity_pct_min"] = ""
    data["flower_intensity_pct_max"] = ""

    return data


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_california_lightworks.py <spec_text_file>")
        print("  e.g. python parse_california_lightworks.py chat.txt")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on URLs
    blocks = re.split(r"(?=https://)", text)
    blocks = [b.strip() for b in blocks if b.strip() and "californialightworks.com" in b]

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_clw_block(block)

        if data is None:
            continue

        make_slug = "california_lightworks"
        model_slug = data["model"].lower().replace(" ", "_").replace("®", "")

        idx = next_index(CSV_PATH)

        row = {
            "index": idx,
            "dba": data["dba"],
            "make": data["make"],
            "make_slug": make_slug,
            "model": data["model"],
            "model_slug": model_slug,
            "type": data["type"],
            "PPF": data["PPF"],
            "efficacy_umol_joule": data["efficacy_umol_joule"],
            "Hz_low": data["Hz_low"],
            "Hz_high": data["Hz_high"],
            "VAC_low": data["VAC_low"],
            "VAC_high": data["VAC_high"],
            "max_Watts": data["max_Watts"],
            "flowering_footprint_length_ft": data["flowering_footprint_length_ft"],
            "flowering_footprint_width_ft": data["flowering_footprint_width_ft"],
            "veg_footprint_length_ft": data["veg_footprint_length_ft"],
            "veg_footprint_width_ft": data["veg_footprint_width_ft"],
            "flowering_mounting_height_min_inches": data["flowering_mounting_height_min_inches"],
            "flowering_mounting_height_max_inches": data["flowering_mounting_height_max_inches"],
            "veg_mounting_height_min_inches": data["veg_mounting_height_min_inches"],
            "veg_mounting_height_max_inches": data["veg_mounting_height_max_inches"],
            "propagation_mounting_height_min_inches": data["propagation_mounting_height_min_inches"],
            "propagation_mounting_height_max_inches": data["propagation_mounting_height_max_inches"],
            "propagation_intensity_pct_min": data["propagation_intensity_pct_min"],
            "propagation_intensity_pct_max": data["propagation_intensity_pct_max"],
            "veg_intensity_pct_min": data["veg_intensity_pct_min"],
            "veg_intensity_pct_max": data["veg_intensity_pct_max"],
            "flower_intensity_pct_min": data["flower_intensity_pct_min"],
            "flower_intensity_pct_max": data["flower_intensity_pct_max"],
            "Thermal Management": data["Thermal Management"],
            "max_ambient_temperature_c": data["max_ambient_temperature_c"],
            "max_ambient_temperature_f": data["max_ambient_temperature_f"],
            "dimmable": data["dimmable"],
            "Dimming Options": data["Dimming Options"],
            "dimensions_length_inches": data["dimensions_length_inches"],
            "dimensions_width_inches": data["dimensions_width_inches"],
            "dimensions_height_inches": data["dimensions_height_inches"],
            "weight_lb": data["weight_lb"],
            "lifespan_hours": data["lifespan_hours"],
            "Warranty_years": data["Warranty_years"],
            "Certifications": data["Certifications"],
            "pdf": data["pdf"],
        }

        with open(CSV_PATH, "a", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writerow(row)

        print(f"Added row {idx}: California Lightworks {data['model']} | PPF:{data['PPF']} | {data['max_Watts']}W | Eff:{data['efficacy_umol_joule']}")


if __name__ == "__main__":
    main()
