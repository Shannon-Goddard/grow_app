import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_ac_infinity(text):
    """Parse AC Infinity tab-separated spec text into a dict matching CSV columns."""
    data = {}

    # Parse tab-separated key-value pairs (strip whitespace)
    fields = {}
    for line in text.strip().splitlines():
        parts = line.split("\t")
        if len(parts) >= 2:
            key = parts[0].strip()
            val = parts[-1].strip()
            if key and val:
                fields[key] = val

    # Metadata
    data["dba"] = "AC Infinity"
    data["make"] = fields.get("Manufacturer", "AC Infinity Inc.")
    data["model"] = fields.get("Product Name", "")
    data["pdf"] = ""  # They link to generic "Product Manual PDF"

    # Type - build from Diodes + Spectrum
    diodes = fields.get("Diodes", "")
    spectrum = fields.get("Spectrum", "")
    if diodes and spectrum:
        data["type"] = f"LED {diodes} ({spectrum})"
    elif diodes:
        data["type"] = f"LED {diodes}"
    else:
        data["type"] = ""

    # PPF / PPFD - AC Infinity lists PPFD not PPF
    ppfd = fields.get("PPFD", "")
    m = re.search(r"([\d.]+)", ppfd)
    data["PPF"] = m.group(1) if m else ""

    # Efficacy
    eff = fields.get("Efficiency (Single Diode)", "") or fields.get("Efficacy", "")
    m = re.search(r"([\d.]+)", eff)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Voltage
    voltage = fields.get("Voltage", "")
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*V", voltage)
    if m:
        data["VAC_low"] = m.group(1)
        data["VAC_high"] = m.group(2)
    else:
        data["VAC_low"] = data["VAC_high"] = ""

    # Frequency
    freq = fields.get("Frequency", "")
    m = re.search(r"(\d+)\s*/\s*(\d+)", freq)
    if m:
        data["Hz_low"] = m.group(1)
        data["Hz_high"] = m.group(2)
    else:
        m = re.search(r"(\d+)", freq)
        if m:
            data["Hz_low"] = m.group(1)
            data["Hz_high"] = m.group(1)
        else:
            data["Hz_low"] = data["Hz_high"] = ""

    # Power
    wattage = fields.get("Wattage", "")
    m = re.search(r"([\d.]+)", wattage)
    data["max_Watts"] = m.group(1) if m else ""

    # Coverage / Footprint
    coverage = fields.get("Coverage", "")
    data["flowering_footprint_length_ft"] = ""
    data["flowering_footprint_width_ft"] = ""
    data["veg_footprint_length_ft"] = ""
    data["veg_footprint_width_ft"] = ""
    if coverage:
        m = re.search(r"([\d.]+)\s*x\s*([\d.]+)\s*ft", coverage, re.IGNORECASE)
        if m:
            # Default coverage to flowering
            data["flowering_footprint_length_ft"] = m.group(1)
            data["flowering_footprint_width_ft"] = m.group(2)

    # Mounting heights
    data["flowering_mounting_height_min_inches"] = ""
    data["flowering_mounting_height_max_inches"] = ""
    data["veg_mounting_height_min_inches"] = ""
    data["veg_mounting_height_max_inches"] = ""
    data["propagation_mounting_height_min_inches"] = ""
    data["propagation_mounting_height_max_inches"] = ""

    # Intensity
    data["propagation_intensity_pct_min"] = ""
    data["propagation_intensity_pct_max"] = ""
    data["veg_intensity_pct_min"] = ""
    data["veg_intensity_pct_max"] = ""
    data["flower_intensity_pct_min"] = ""
    data["flower_intensity_pct_max"] = ""

    # Thermal Management
    data["Thermal Management"] = ""

    # Max Ambient Temperature - "32 to 140°F"
    op_temp = fields.get("Operating Temperature", "")
    m = re.search(r"(\d+)\s*(?:to|-)\s*(\d+)\s*°?\s*F", op_temp)
    if m:
        # Convert max F to C
        max_f = m.group(2)
        max_c = round((int(max_f) - 32) * 5 / 9, 2)
        data["max_ambient_temperature_c"] = str(max_c)
        data["max_ambient_temperature_f"] = max_f
    else:
        data["max_ambient_temperature_c"] = ""
        data["max_ambient_temperature_f"] = ""

    # Dimmable
    controller = fields.get("Controller", "")
    if controller and "dimm" in controller.lower():
        data["dimmable"] = "TRUE"
        data["Dimming Options"] = controller
    else:
        data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

    # Dimensions - "16.14 x 32.67 x 3.03 in." or "10.98 x 1.08 in."
    dims = fields.get("Light Dimensions", "")
    m = re.search(r"([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)\s*in", dims)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        m = re.search(r"([\d.]+)\s*x\s*([\d.]+)\s*in", dims)
        if m:
            data["dimensions_length_inches"] = m.group(1)
            data["dimensions_width_inches"] = m.group(2)
            data["dimensions_height_inches"] = ""
        else:
            data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Weight
    weight = fields.get("Weight", "")
    m = re.search(r"([\d.]+)", weight)
    data["weight_lb"] = m.group(1) if m else ""

    # Lifespan
    life = fields.get("Life Expectancy", "")
    m = re.search(r"([\d,]+)", life)
    data["lifespan_hours"] = m.group(1).replace(",", "") if m else ""

    # Warranty
    warranty = fields.get("Warranty", "")
    m = re.search(r"(\d+)", warranty)
    data["Warranty_years"] = m.group(1) if m else ""

    # Certifications - combine Waterproof Rating and ETL if present
    certs = []
    wp = fields.get("Waterproof Rating", "")
    if wp:
        certs.append(wp.replace("-", ""))
    etl = fields.get("ETL Certification", "")
    if etl and "PDF" not in etl:
        certs.append(etl)
    data["Certifications"] = ", ".join(certs) if certs else ""

    return data


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_ac_infinity.py <spec_text_file>")
        print("  e.g. python parse_ac_infinity.py chat.txt")
        print("")
        print("  File can contain multiple products separated by blank lines.")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on double newlines (blank lines) to handle multiple products
    blocks = re.split(r"\n\s*\n", text)
    blocks = [b.strip() for b in blocks if b.strip() and "Manufacturer" in b]

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_ac_infinity(block)

        make = data.get("make", "")
        model = data.get("model", "")
        pdf = data.get("pdf", "")
        make_slug = make.lower().replace(" ", "_").replace(".", "") if make else ""
        model_slug = model.lower().replace(" ", "_") if model else ""

        idx = next_index(CSV_PATH)

        row = {
            "index": idx,
            "dba": data["dba"],
            "make": make,
            "make_slug": make_slug,
            "model": model,
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
            "pdf": pdf,
        }

        with open(CSV_PATH, "a", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writerow(row)

        print(f"Added row {idx}: {make} {model}")


if __name__ == "__main__":
    main()
