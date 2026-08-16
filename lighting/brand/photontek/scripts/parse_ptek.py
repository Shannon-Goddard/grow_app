import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_ptek_block(block):
    """Parse a single P-Tek product block."""
    data = {}

    data["dba"] = "P-Tek"
    data["make"] = "P-Tek"
    data["pdf"] = ""

    # Model - first line or second line that contains "P-TEK"
    lines = block.strip().splitlines()
    model = ""
    for line in lines:
        if "P-TEK" in line.upper() or "P-Tek" in line:
            model = line.strip()
            break
    # Clean up: remove "PRO LED" prefix, "FULL-SPECTRUM" etc
    model = re.sub(r"^(?:FULL-SPECTRUM\s*)?(?:PRO LED\s*)?", "", model, flags=re.IGNORECASE).strip()
    data["model"] = model

    # Extract colon-separated fields from the spec section
    fields = {}
    for line in lines:
        m = re.match(r"^([A-Za-z][A-Za-z &/()]+?):\s*(.+)", line.strip())
        if m:
            key = m.group(1).strip()
            val = m.group(2).strip()
            # Only store first occurrence (avoid multi-line continuations overwriting)
            if key not in fields:
                fields[key] = val

    # Type - from Light Source
    light_source = fields.get("Light Source", "")
    data["type"] = f"LED {light_source}" if light_source else "LED Full Spectrum"

    # PPF - "2925 µmol/s"
    ppf = fields.get("PPF", "")
    m = re.search(r"([\d.]+)", ppf)
    data["PPF"] = m.group(1) if m else ""

    # Efficacy - "2.9 µmol/J"
    eff = fields.get("Efficacy", "")
    m = re.search(r"([\d.]+)", eff)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Voltage and Frequency - "120-277V, 50-60Hz"
    voltage = fields.get("Input Voltage", "")
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*V", voltage)
    if m:
        data["VAC_low"] = m.group(1)
        data["VAC_high"] = m.group(2)
    else:
        data["VAC_low"] = data["VAC_high"] = ""

    m = re.search(r"(\d+)\s*-\s*(\d+)\s*Hz", voltage)
    if m:
        data["Hz_low"] = m.group(1)
        data["Hz_high"] = m.group(2)
    else:
        data["Hz_low"] = data["Hz_high"] = ""

    # Power - from Input Power "1005W (277V±5%)" - take first number
    power = fields.get("Input Power", "")
    m = re.search(r"(\d+)\s*W", power)
    data["max_Watts"] = m.group(1) if m else ""

    # Footprint - "6.5´x 5´" or "5'x5'" or "5'x5' with Supp. CO2"
    footprint = fields.get("Footprint", "")
    # Normalize special prime marks
    footprint = footprint.replace("\u00b4", "'").replace("\u2032", "'")
    m = re.search(r"([\d.]+)['\s]*x\s*([\d.]+)", footprint, re.IGNORECASE)
    if m:
        data["flowering_footprint_length_ft"] = m.group(1)
        data["flowering_footprint_width_ft"] = m.group(2)
    else:
        data["flowering_footprint_length_ft"] = data["flowering_footprint_width_ft"] = ""
    data["veg_footprint_length_ft"] = ""
    data["veg_footprint_width_ft"] = ""

    # Dimensions - "66.92'' x 48'' x 1.9''" or "46.50''x 42.95'' x 4.16''"
    dims = fields.get("Dimensions", "")
    m = re.search(r"([\d.]+)['\"\s]*x\s*([\d.]+)['\"\s]*x\s*([\d.]+)", dims)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Weight - "39.68 Lbs"
    weight = fields.get("Weight", "")
    m = re.search(r"([\d.]+)", weight)
    data["weight_lb"] = m.group(1) if m else ""

    # Lifespan - "60 000 Hrs"
    life = fields.get("Lifetime (LED Bars)", "") or fields.get("Lifetime", "")
    m = re.search(r"([\d\s]+)", life)
    data["lifespan_hours"] = m.group(1).replace(" ", "").strip() if m else ""

    # Warranty - "5 Years"
    warranty = fields.get("Warranty", "")
    m = re.search(r"(\d+)", warranty)
    data["Warranty_years"] = m.group(1) if m else ""

    # Dimmable - "OFF-25%-50%-75%-100% with 0-10V Light Dimmer (Included)"
    dimmable = fields.get("Dimmable", "")
    if dimmable:
        data["dimmable"] = "TRUE"
        data["Dimming Options"] = dimmable
    else:
        data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

    # Thermal Management
    data["Thermal Management"] = fields.get("Thermal Management", "")

    # Certifications
    data["Certifications"] = fields.get("Certifications", "")

    # Waterproof rating (add to certifications if not already there)
    wp = fields.get("Waterproof & Dustproof", "")
    if wp and wp not in data["Certifications"]:
        if data["Certifications"]:
            data["Certifications"] += ", " + wp
        else:
            data["Certifications"] = wp

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
    data["max_ambient_temperature_c"] = ""
    data["max_ambient_temperature_f"] = ""

    return data


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_ptek.py <spec_text_file>")
        print("  e.g. python parse_ptek.py chat.txt")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on "Product Code:" which starts each spec section
    # But we need the model name which is above. Split on blank lines between products.
    # Each product has "P-TEK" in its header
    blocks = re.split(r"\n\s*\n(?=.*P-TEK)", text, flags=re.IGNORECASE)
    blocks = [b.strip() for b in blocks if b.strip() and "Product Code" in b]

    if not blocks:
        # Try splitting on "DISTRIBUTION CURVE" which appears at start of each product
        blocks = re.split(r"(?=(?:FULL-SPECTRUM|P-TEK))", text, flags=re.IGNORECASE)
        blocks = [b.strip() for b in blocks if b.strip() and "Product Code" in b]

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_ptek_block(block)

        if not data["model"]:
            continue

        make_slug = "p_tek"
        model_slug = data["model"].lower().replace(" ", "_").replace("-", "_")

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

        print(f"Added row {idx}: P-Tek {data['model']} | PPF:{data['PPF']} | {data['max_Watts']}W | Eff:{data['efficacy_umol_joule']} | Flower:{data['flowering_footprint_length_ft']}x{data['flowering_footprint_width_ft']}")


if __name__ == "__main__":
    main()
