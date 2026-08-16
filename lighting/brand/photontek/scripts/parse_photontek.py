import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_photontek_block(block):
    """Parse a single Photontek product block."""
    data = {}

    data["dba"] = "Photontek"
    data["make"] = "Photontek Lighting"

    lines = [l.strip() for l in block.strip().splitlines() if l.strip()]

    # URL is first line - extract model and pdf from it
    url = ""
    for line in lines:
        if line.startswith("http") or line.startswith("url:"):
            url = line.replace("url:", "").strip()
            break

    data["pdf_url"] = url

    # Model from URL slug: /led/x-1000w-pro-led/ -> X 1000W Pro LED
    # PDF from URL slug: x-1000w-pro-led.pdf
    if url:
        m = re.search(r"photontek-lighting\.com/(?:led/)?(.+?)/?$", url)
        if m:
            slug = m.group(1).strip("/")
            data["pdf"] = slug + ".pdf"
            # Convert slug to model name
            model = slug.replace("-", " ").title()
            # Fix common patterns
            model = re.sub(r"(\d+)w", lambda x: x.group(1) + "W", model, flags=re.IGNORECASE)
            model = model.replace("Led", "LED").replace("Uv", "UV")
            data["model"] = model
        else:
            data["model"] = ""
            data["pdf"] = ""
    else:
        data["model"] = ""
        data["pdf"] = ""

    # Parse colon-separated fields (case-insensitive keys)
    fields = {}
    for line in lines:
        if line.startswith("http") or line.startswith("url:"):
            continue
        # Match "Key: Value" or "KEY: VALUE" - key can have parens, brackets, hyphens
        m = re.match(r"^([A-Za-z][A-Za-z0-9 &/()[\]\-_.]*?):\s*(.+)", line)
        if m:
            key = m.group(1).strip().upper()
            val = m.group(2).strip()
            if key not in fields:
                fields[key] = val

    # Type - from Light Source or Spectrum
    light_source = fields.get("LIGHT SOURCE", "")
    spectrum = fields.get("SPECTRUM", "")
    if light_source:
        data["type"] = f"LED {light_source}"
    elif spectrum:
        data["type"] = f"LED {spectrum}"
    else:
        data["type"] = "LED Full Spectrum"

    # PPF
    ppf = fields.get("PPF", "") or fields.get("PPF [400-750] NM", "")
    m = re.search(r"([\d.]+)", ppf)
    data["PPF"] = m.group(1) if m else ""

    # Efficacy
    eff = fields.get("EFFICACY", "") or fields.get("EFFICACY [400-750] NM", "")
    m = re.search(r"([\d.]+)", eff)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Voltage and Frequency
    voltage = fields.get("INPUT VOLTAGE", "")
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*V", voltage)
    if m:
        data["VAC_low"] = m.group(1)
        data["VAC_high"] = m.group(2)
    else:
        data["VAC_low"] = data["VAC_high"] = ""

    m = re.search(r"(\d+)\s*-\s*(\d+)\s*Hz", voltage, re.IGNORECASE)
    if m:
        data["Hz_low"] = m.group(1)
        data["Hz_high"] = m.group(2)
    else:
        data["Hz_low"] = data["Hz_high"] = ""

    # Power
    power = fields.get("INPUT POWER", "") or fields.get("INPUT POWER (100%)", "") or fields.get("POWER CONSUMPTION", "")
    m = re.search(r"(\d+)\s*W", power)
    data["max_Watts"] = m.group(1) if m else ""

    # Footprint / Coverage
    footprint = fields.get("FOOTPRINT", "") or fields.get("COVERAGE AREA", "")
    # Normalize special prime/apostrophe marks
    footprint = footprint.replace("\u00b4", "'").replace("\u2019", "'").replace("\u2032", "'")
    # Handle "5' x 5' V / 4' x 4' F" format
    flower_m = re.search(r"([\d.]+)['\s]*x\s*([\d.]+)['\s]*F", footprint, re.IGNORECASE)
    veg_m = re.search(r"([\d.]+)['\s]*x\s*([\d.]+)['\s]*V", footprint, re.IGNORECASE)
    if flower_m:
        data["flowering_footprint_length_ft"] = flower_m.group(1)
        data["flowering_footprint_width_ft"] = flower_m.group(2)
    elif not veg_m:
        # Just take the first/largest footprint as flowering
        all_dims = re.findall(r"([\d.]+)['\s]*x\s*([\d.]+)", footprint)
        if all_dims:
            data["flowering_footprint_length_ft"] = all_dims[-1][0]
            data["flowering_footprint_width_ft"] = all_dims[-1][1]
        else:
            # Try "X x X ft." format
            m = re.search(r"([\d.]+)\s*x\s*([\d.]+)\s*ft", footprint, re.IGNORECASE)
            if m:
                data["flowering_footprint_length_ft"] = m.group(1)
                data["flowering_footprint_width_ft"] = m.group(2)
            else:
                data["flowering_footprint_length_ft"] = data["flowering_footprint_width_ft"] = ""
    else:
        data["flowering_footprint_length_ft"] = data["flowering_footprint_width_ft"] = ""

    if veg_m:
        data["veg_footprint_length_ft"] = veg_m.group(1)
        data["veg_footprint_width_ft"] = veg_m.group(2)
    else:
        data["veg_footprint_length_ft"] = data["veg_footprint_width_ft"] = ""

    # Dimensions
    dims = fields.get("DIMENSIONS", "")
    m = re.search(r"([\d.]+)['\"\s]*x\s*([\d.]+)['\"\s]*x\s*([\d.]+)", dims)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Weight
    weight = fields.get("WEIGHT", "") or fields.get("NET WEIGHT", "")
    m = re.search(r"([\d.]+)\s*lbs?", weight, re.IGNORECASE)
    data["weight_lb"] = m.group(1) if m else ""

    # Lifespan
    life = fields.get("LIFETIME", "") or fields.get("LIFETIME (LED BARS)", "") or fields.get("LIFE SPAN", "")
    m = re.search(r"([\d\s]+)", life)
    data["lifespan_hours"] = m.group(1).replace(" ", "").strip() if m else ""

    # Warranty
    warranty = fields.get("WARRANTY", "")
    m = re.search(r"(\d+)", warranty)
    data["Warranty_years"] = m.group(1) if m else ""

    # Dimmable
    dimmable = fields.get("DIMMABLE", "") or fields.get("DIMMING", "")
    if dimmable and dimmable.lower() != "no":
        data["dimmable"] = "TRUE"
        data["Dimming Options"] = dimmable
    else:
        data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

    # Thermal Management
    data["Thermal Management"] = fields.get("THERMAL MANAGEMENT", "")

    # Certifications
    certs = fields.get("CERTIFICATIONS", "") or fields.get("IP RATING", "")
    wp = fields.get("WATERPROOF", "") or fields.get("WATERPROOF & DUSTPROOF", "") or fields.get("WATERPROOF/DUSTPROOF", "")
    if wp and wp not in certs:
        certs = (certs + ", " + wp).strip(", ")
    data["Certifications"] = certs

    # Max ambient temp
    max_temp = fields.get("MAX AMBIENT TEMPERATURE", "")
    m = re.search(r"(\d+)\s*°?\s*F.*?(\d+)\s*°?\s*C", max_temp)
    if m:
        data["max_ambient_temperature_f"] = m.group(1)
        data["max_ambient_temperature_c"] = m.group(2)
    else:
        m = re.search(r"(\d+)\s*°?\s*C", max_temp)
        if m:
            data["max_ambient_temperature_c"] = m.group(1)
            data["max_ambient_temperature_f"] = ""
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

    return data


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_photontek.py <spec_text_file>")
        print("  e.g. python parse_photontek.py chat.txt")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on URLs
    blocks = re.split(r"(?=(?:url:\s*)?https://photontek)", text)
    blocks = [b.strip() for b in blocks if b.strip() and "photontek" in b.lower()]

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_photontek_block(block)

        if not data["model"]:
            continue

        make_slug = "photontek_lighting"
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

        print(f"Added row {idx}: Photontek {data['model']} | PPF:{data['PPF']} | {data['max_Watts']}W | Eff:{data['efficacy_umol_joule']} | Flower:{data['flowering_footprint_length_ft']}x{data['flowering_footprint_width_ft']}")


if __name__ == "__main__":
    main()
