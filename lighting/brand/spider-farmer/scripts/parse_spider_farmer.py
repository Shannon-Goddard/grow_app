import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_sf_product(text):
    """Parse a single Spider Farmer tab-separated spec block."""
    data = {}

    # Parse tab-separated key-value pairs
    fields = {}
    for line in text.strip().splitlines():
        parts = line.split("\t")
        if len(parts) >= 2:
            key = parts[0].strip()
            val = parts[-1].strip()
            if key and val:
                fields[key] = val

    data["dba"] = "Spider Farmer"
    data["make"] = fields.get("Brand", "Spider Farmer")
    data["model"] = fields.get("Product Model", "") or fields.get("Product Name", "")
    data["pdf"] = ""

    # Type - LED field or Spectrum
    led = fields.get("LED", "")
    spectrum = fields.get("Spectrum", "")
    if led:
        data["type"] = f"LED {led}"
    elif spectrum:
        data["type"] = f"LED {spectrum}"
    else:
        data["type"] = ""

    # PPF
    ppf = fields.get("PPF", "")
    m = re.search(r"([\d.]+)", ppf)
    data["PPF"] = m.group(1) if m else ""

    # Efficacy (PPE)
    ppe = fields.get("PPE", "")
    m = re.search(r"([\d.]+)", ppe)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Voltage - from Input Voltage "AC100-277V" or Power Draw "300W±5%@AC120-277V"
    voltage = fields.get("Input Voltage", "")
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*V", voltage)
    if m:
        data["VAC_low"] = m.group(1)
        data["VAC_high"] = m.group(2)
    else:
        data["VAC_low"] = data["VAC_high"] = ""

    # Frequency
    freq = fields.get("Frequency", "")
    m = re.search(r"(\d+)\s*[-/]\s*(\d+)", freq)
    if m:
        data["Hz_low"] = m.group(1)
        data["Hz_high"] = m.group(2)
    else:
        data["Hz_low"] = data["Hz_high"] = ""

    # Power - from Power Draw or Single Bar Wattage
    power = fields.get("Power Draw", "") or fields.get("Single Bar Wattage", "")
    m = re.search(r"(\d+)\s*W", power, re.IGNORECASE)
    data["max_Watts"] = m.group(1) if m else ""

    # Coverage
    core = fields.get("Core Coverage", "") or fields.get("Coverage", "")
    max_cov = fields.get("Max Coverage", "")

    # Parse coverage "2 x 2 ft." or "3 x 3 ft."
    def parse_coverage(s):
        m = re.search(r"([\d.]+)\s*[xX×]\s*([\d.]+)", s)
        if m:
            return m.group(1), m.group(2)
        return "", ""

    # Core = veg (tighter canopy), Max = flower (what matters to buyer)
    fl, fw = parse_coverage(max_cov)
    data["flowering_footprint_length_ft"] = fl
    data["flowering_footprint_width_ft"] = fw

    vl, vw = parse_coverage(core)
    data["veg_footprint_length_ft"] = vl
    data["veg_footprint_width_ft"] = vw

    # Dimensions - various formats
    dims = fields.get("Light Size", "") or fields.get("Single Bar Size", "")
    # Try "23.73 x 23.01 x 2.80 Inch" or "23.62" x 1.31" x 1.22""
    m = re.search(r"([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)\s*(?:Inch|IN)", dims, re.IGNORECASE)
    if not m:
        # Try inches with quotes: 23.62" x 1.31" x 1.22"
        m = re.search(r"([\d.]+)\"\s*[x×]\s*([\d.]+)\"\s*[x×]\s*([\d.]+)", dims)
    if not m:
        # Try "38.6" × 1.77" × 1.46""
        m = re.search(r"([\d.]+)\"?\s*[x×]\s*([\d.]+)\"?\s*[x×]\s*([\d.]+)", dims)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Weight - Net Weight in kg, convert to lbs
    weight = fields.get("Net Weight", "")
    m = re.search(r"([\d.]+)\s*kg", weight, re.IGNORECASE)
    if m:
        lbs = round(float(m.group(1)) * 2.20462, 2)
        data["weight_lb"] = str(lbs)
    else:
        data["weight_lb"] = ""

    # Lifespan
    life = fields.get("Lifespan", "") or fields.get("Lifetime", "")
    m = re.search(r"([\d,]+)", life)
    data["lifespan_hours"] = m.group(1).replace(",", "") if m else ""

    # Warranty
    warranty = fields.get("Warranty", "")
    m = re.search(r"(\d+)", warranty)
    data["Warranty_years"] = m.group(1) if m else ""

    # Dimmable - from Lighting Control Protocols
    dimming = fields.get("Lighting Control Protocols", "")
    if dimming:
        data["dimmable"] = "TRUE"
        data["Dimming Options"] = dimming
    else:
        data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

    # Operating Temperature - "-20-35℃(-4-95℉)"
    op_temp = fields.get("Operating Temperature", "")
    m = re.search(r"[-\d.]+-\s*([\d.]+)\s*[℃°C].*?([\d.]+)\s*[℉°F]", op_temp)
    if m:
        data["max_ambient_temperature_c"] = m.group(1)
        data["max_ambient_temperature_f"] = m.group(2)
    else:
        data["max_ambient_temperature_c"] = data["max_ambient_temperature_f"] = ""

    # Empty fields
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
    data["Thermal Management"] = ""
    data["Certifications"] = ""

    return data


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_spider_farmer.py <spec_text_file>")
        print("  e.g. python parse_spider_farmer.py chat.txt")
        print("")
        print("  File can contain multiple products separated by blank lines.")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on product boundaries
    # Try "Specifications" headers first
    blocks = re.split(r"(?=\S+\s+Specifications)|(?=Product Specifications\s*-)", text)
    if len(blocks) <= 1:
        # Try splitting on "Product Identification" (but keep it with the block)
        blocks = re.split(r"(?=Product Identification\n)", text)
    
    blocks = [b.strip() for b in blocks if b.strip() and ("Product Name" in b or "Product Model" in b or "Brand" in b)]

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_sf_product(block)

        if not data["model"]:
            continue

        make_slug = "spider_farmer"
        model_slug = data["model"].lower().replace(" ", "_")

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

        print(f"Added row {idx}: Spider Farmer {data['model']} | PPF:{data['PPF']} | {data['max_Watts']}W | {data['efficacy_umol_joule']} umol/J | Flower:{data['flowering_footprint_length_ft']}x{data['flowering_footprint_width_ft']}")


if __name__ == "__main__":
    main()
