import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_vivosun_block(block):
    """Parse a single Vivosun product block."""
    data = {}

    data["dba"] = "Vivosun"
    data["make"] = "Vivosun"
    data["pdf"] = ""

    lines = [l.strip() for l in block.strip().splitlines() if l.strip()]

    # Parse alternating key-value lines
    # Handle multi-line values (like Dimming which spans 2 lines)
    fields = {}
    i = 0
    while i < len(lines) - 1:
        key = lines[i]
        val = lines[i + 1]
        # Check if the line after val is NOT a known field name pattern
        # If so, it's a continuation of the value
        i += 2
        while i < len(lines):
            next_line = lines[i]
            # Known keys start with uppercase word or specific patterns
            if re.match(r"^(Model Name|Dimensions|Weight|Light Coverage|Spectrum|Efficiency|PPFD|Dimming|Maximum|Noise|Wattage|Input Voltage|Waterproof|Lifespan|Power Cord)", next_line):
                break
            # It's a continuation
            val += " | " + next_line
            i += 1
        fields[key] = val

    # Model
    data["model"] = fields.get("Model Name", "")

    # Type
    spectrum = fields.get("Spectrum", "")
    data["type"] = f"LED {spectrum}" if spectrum else "LED"

    # No PPF listed - they list PPFD instead
    ppfd = fields.get("PPFD", "")
    data["PPF"] = ""  # PPFD != PPF, leave empty

    # Efficacy
    eff = fields.get("Efficiency", "")
    m = re.search(r"([\d.]+)", eff)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Wattage
    wattage = fields.get("Wattage", "")
    m = re.search(r"(\d+)", wattage)
    data["max_Watts"] = m.group(1) if m else ""

    # Voltage and Frequency - "120-240VAC, 50-60Hz" or "120-240VAC， 50-60Hz"
    voltage = fields.get("Input Voltage", "")
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*VAC", voltage, re.IGNORECASE)
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

    # Coverage - "2.7 x 2.7 ft." or "2 x 4 ft." or "4 x 2 ft."
    coverage = fields.get("Light Coverage", "")
    m = re.search(r"([\d.]+)\s*[xX]\s*([\d.]+)", coverage)
    if m:
        data["flowering_footprint_length_ft"] = m.group(1)
        data["flowering_footprint_width_ft"] = m.group(2)
    else:
        data["flowering_footprint_length_ft"] = data["flowering_footprint_width_ft"] = ""
    data["veg_footprint_length_ft"] = ""
    data["veg_footprint_width_ft"] = ""

    # Dimensions - "13 x 13 x 2.1 in." or "12.9 x 12.9 x 2.1 in.(32.8 x 32.8 x 5.4 cm)"
    dims = fields.get("Dimensions", "")
    m = re.search(r"([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)\s*in", dims, re.IGNORECASE)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        # Try "one bar: 16.3 x 1.0 x 0.5 in."
        m = re.search(r"([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)\s*in", dims, re.IGNORECASE)
        if m:
            data["dimensions_length_inches"] = m.group(1)
            data["dimensions_width_inches"] = m.group(2)
            data["dimensions_height_inches"] = m.group(3)
        else:
            data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Weight - "5.7 lbs." or "3.9 lbs. (1.8 kg)"
    weight = fields.get("Weight", "")
    m = re.search(r"([\d.]+)\s*lbs?", weight, re.IGNORECASE)
    data["weight_lb"] = m.group(1) if m else ""

    # Lifespan - "50,000 hrs."
    life = fields.get("Lifespan", "")
    m = re.search(r"([\d,]+)", life)
    data["lifespan_hours"] = m.group(1).replace(",", "") if m else ""

    # Dimmable
    dimming = fields.get("Dimming", "")
    if dimming:
        data["dimmable"] = "TRUE"
        data["Dimming Options"] = dimming
    else:
        data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

    # Certifications (waterproof rating)
    data["Certifications"] = fields.get("Waterproof Rating", "")

    # Empty fields
    data["Thermal Management"] = ""
    data["max_ambient_temperature_c"] = ""
    data["max_ambient_temperature_f"] = ""
    data["Warranty_years"] = ""
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
        print("Usage: python parse_vivosun.py <spec_text_file>")
        print("  e.g. python parse_vivosun.py chat.txt")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on "Model Name" which starts each product
    blocks = re.split(r"(?=Model Name\n)", text)
    blocks = [b.strip() for b in blocks if b.strip() and "Model Name" in b]

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_vivosun_block(block)

        if not data["model"]:
            continue

        make_slug = "vivosun"
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

        print(f"Added row {idx}: Vivosun {data['model']} | {data['max_Watts']}W | Eff:{data['efficacy_umol_joule']} | Cover:{data['flowering_footprint_length_ft']}x{data['flowering_footprint_width_ft']}")


if __name__ == "__main__":
    main()
