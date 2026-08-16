import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_mars_hydro_block(block):
    """Parse a single Mars Hydro product block."""
    data = {}

    data["dba"] = "Mars Hydro"
    data["make"] = "Mars Hydro"

    # URL is the first line (use as pdf column)
    lines = block.strip().splitlines()
    url = ""
    for line in lines:
        if line.strip().startswith("http"):
            url = line.strip()
            break
    data["pdf"] = url

    # Model from URL slug: /fc-e1500-led-grow-light-a -> FC-E1500
    if url:
        m = re.search(r"mars-hydro\.com/(.+?)(?:\?|$)", url)
        if m:
            slug = m.group(1).rstrip("/")
            # Clean up: remove generic suffixes
            slug = re.sub(r"-led-grow-light.*", "", slug)
            slug = re.sub(r"-commercial.*", "", slug)
            slug = re.sub(r"-co2.*", "", slug)
            slug = re.sub(r"-usa$", "", slug)
            # Remove "2pcs-" prefix
            slug = re.sub(r"^\dpcs-", "", slug)
            data["model"] = slug.upper().replace("-", " ").strip()
        else:
            data["model"] = ""
    else:
        data["model"] = ""

    # Parse tab-separated fields
    fields = {}
    for line in lines:
        parts = line.split("\t")
        if len(parts) >= 2:
            key = parts[0].strip()
            val = parts[-1].strip()
            if key and val:
                fields[key] = val

    # Type
    chip = fields.get("Chip Brand", "")
    spectrum = fields.get("Spectrum", "")
    data["type"] = f"LED {chip}" if chip else ""

    # PPF
    ppf = fields.get("PPF", "")
    m = re.search(r"([\d.]+)", ppf)
    data["PPF"] = m.group(1) if m else ""

    # Efficacy (PPE)
    ppe = fields.get("PPE", "")
    m = re.search(r"([\d.]+)", ppe)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Voltage
    voltage = fields.get("Voltage", "")
    m = re.search(r"AC(\d+)\s*-\s*(\d+)\s*V", voltage)
    if m:
        data["VAC_low"] = m.group(1)
        data["VAC_high"] = m.group(2)
    else:
        data["VAC_low"] = data["VAC_high"] = ""

    # Frequency (not listed, Mars Hydro is typically 50/60)
    data["Hz_low"] = ""
    data["Hz_high"] = ""

    # Power - from WATTAGE "150W±5%@120-277V" or "1000W+5%@AC220-277V"
    wattage = fields.get("WATTAGE", "")
    m = re.search(r"(\d+)\s*W", wattage)
    data["max_Watts"] = m.group(1) if m else ""

    # Coverage - Max Coverage "5'x5'" or "2.5'x2.5'"
    max_cov = fields.get("Max Coverage", "")
    m = re.search(r"([\d.]+)['']\s*[xX×]\s*([\d.]+)", max_cov)
    if m:
        data["flowering_footprint_length_ft"] = m.group(1)
        data["flowering_footprint_width_ft"] = m.group(2)
    else:
        data["flowering_footprint_length_ft"] = data["flowering_footprint_width_ft"] = ""

    data["veg_footprint_length_ft"] = ""
    data["veg_footprint_width_ft"] = ""

    # Dimensions - "16.4*15.7*2.8 IN" or "33\"L x 33\"W x 3.1\"H"
    dim = fields.get("Dimension", "")
    m = re.search(r"([\d.]+)[\"*\s]*[xX*Ll]\s*([\d.]+)[\"*\s]*[xX*Ww]\s*([\d.]+)", dim)
    if not m:
        m = re.search(r"([\d.]+)\s*[*x]\s*([\d.]+)\s*[*x]\s*([\d.]+)", dim)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Lifespan
    life = fields.get("Lifespan", "")
    m = re.search(r"([\d]+)", life)
    data["lifespan_hours"] = m.group(1) if m else ""

    # Warranty
    warranty = fields.get("WARRANTY", "")
    m = re.search(r"(\d+)", warranty)
    data["Warranty_years"] = m.group(1) if m else ""

    # Certifications
    data["Certifications"] = fields.get("Certificate", "")

    # Dimmable (Mars Hydro FC-E series are all dimmable)
    data["dimmable"] = "TRUE"
    data["Dimming Options"] = "0-10V"

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
    data["max_ambient_temperature_c"] = ""
    data["max_ambient_temperature_f"] = ""
    data["weight_lb"] = ""

    return data


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_mars_hydro.py <spec_text_file>")
        print("  e.g. python parse_mars_hydro.py chat.txt")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on URLs (each product starts with https://)
    blocks = re.split(r"(?=https://)", text)
    blocks = [b.strip() for b in blocks if b.strip() and "mars-hydro.com" in b]

    # Deduplicate by URL (e.g. "2pcs-fc-e1500" is same light as "fc-e1500")
    seen_models = set()

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_mars_hydro_block(block)

        if not data["model"]:
            continue

        # Skip duplicates (like 2pcs bundle = same light)
        if data["model"] in seen_models:
            continue
        seen_models.add(data["model"])

        make_slug = "mars_hydro"
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

        print(f"Added row {idx}: Mars Hydro {data['model']} | PPF:{data['PPF']} | {data['max_Watts']}W | {data['flowering_footprint_length_ft']}x{data['flowering_footprint_width_ft']}")


if __name__ == "__main__":
    main()
