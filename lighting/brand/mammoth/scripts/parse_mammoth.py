import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")


def parse_mammoth(text):
    """Parse a single Mammoth Lighting spec block."""
    data = {}

    data["dba"] = "Mammoth"
    data["make"] = "Mammoth Lighting"
    data["pdf"] = ""

    # Model - appears after "Model" line
    m = re.search(r"Model\s*\n(.+?)(?:\n|Series)", text, re.IGNORECASE | re.DOTALL)
    if m:
        model = m.group(1).replace("\r", "").replace("\n", " ").strip()
        # Clean up trailing "Series" if not already there
        model = re.sub(r"\s+", " ", model)
        data["model"] = model
    else:
        data["model"] = ""

    # Spectrum / Type
    m = re.search(r"Spectrum\s*\n?\s*(.*?)(?:\n\s*(?:Power|Product))", text, re.IGNORECASE | re.DOTALL)
    if m:
        spec = m.group(1).replace("\r", "").replace("\n", " ").strip()
        data["type"] = f"LED {spec}" if spec and not spec.startswith("LED") else spec
    else:
        data["type"] = ""

    # PPF - look for μmol/s value
    m = re.search(r"PPF.*?([\d,]+)\s*μmol/s", text, re.IGNORECASE | re.DOTALL)
    if not m:
        m = re.search(r"([\d,]+)\s*μmol/s", text)
    if m:
        data["PPF"] = m.group(1).replace(",", "")
    else:
        data["PPF"] = ""

    # Efficacy
    m = re.search(r"([\d.]+)\s*μmol/J", text)
    data["efficacy_umol_joule"] = m.group(1) if m else ""

    # Power - look for total wattage
    m = re.search(r"(\d+)w\s*Total", text, re.IGNORECASE)
    if not m:
        # Try standalone power line
        m = re.search(r"Power\s*\n?\s*(\d+)w", text, re.IGNORECASE)
    data["max_Watts"] = m.group(1) if m else ""

    # Voltage
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*V\s*(?:standard|AC)?", text, re.IGNORECASE)
    if m:
        data["VAC_low"] = m.group(1)
        data["VAC_high"] = m.group(2)
    else:
        data["VAC_low"] = data["VAC_high"] = ""

    # Frequency
    m = re.search(r"(\d+)\s*/\s*(\d+)\s*Hz", text)
    if m:
        data["Hz_low"] = m.group(1)
        data["Hz_high"] = m.group(2)
    else:
        data["Hz_low"] = data["Hz_high"] = ""

    # Coverage - Veg and Flower
    vm = re.search(r"Veg:\s*(\d+)\s*x\s*(\d+)", text, re.IGNORECASE)
    fm = re.search(r"Flower:\s*(\d+)\s*x\s*(\d+)", text, re.IGNORECASE)
    data["veg_footprint_length_ft"] = vm.group(1) if vm else ""
    data["veg_footprint_width_ft"] = vm.group(2) if vm else ""
    data["flowering_footprint_length_ft"] = fm.group(1) if fm else ""
    data["flowering_footprint_width_ft"] = fm.group(2) if fm else ""

    # Mounting heights (not in Mammoth specs)
    data["flowering_mounting_height_min_inches"] = ""
    data["flowering_mounting_height_max_inches"] = ""
    data["veg_mounting_height_min_inches"] = ""
    data["veg_mounting_height_max_inches"] = ""
    data["propagation_mounting_height_min_inches"] = ""
    data["propagation_mounting_height_max_inches"] = ""

    # Intensity (not in Mammoth specs)
    data["propagation_intensity_pct_min"] = ""
    data["propagation_intensity_pct_max"] = ""
    data["veg_intensity_pct_min"] = ""
    data["veg_intensity_pct_max"] = ""
    data["flower_intensity_pct_min"] = ""
    data["flower_intensity_pct_max"] = ""

    # Thermal Management
    data["Thermal Management"] = ""

    # Max Ambient Temperature (not in Mammoth specs)
    data["max_ambient_temperature_c"] = ""
    data["max_ambient_temperature_f"] = ""

    # Dimming
    m = re.search(r"Dimming\s*\n?\s*(0-10v[^\n]*)", text, re.IGNORECASE)
    if m:
        data["dimmable"] = "TRUE"
        data["Dimming Options"] = m.group(1).strip()
    else:
        data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

    # Dimensions - "44" X44"X 4""
    m = re.search(r"(\d+)[\"']\s*X\s*(\d+)[\"']\s*X\s*(\d+)[\"']", text, re.IGNORECASE)
    if m:
        data["dimensions_length_inches"] = m.group(1)
        data["dimensions_width_inches"] = m.group(2)
        data["dimensions_height_inches"] = m.group(3)
    else:
        data["dimensions_length_inches"] = data["dimensions_width_inches"] = data["dimensions_height_inches"] = ""

    # Weight - look for lbs value
    m = re.search(r"(\d+(?:\.\d+)?)\s*lbs?", text, re.IGNORECASE)
    data["weight_lb"] = m.group(1) if m else ""

    # Lifespan
    m = re.search(r"L90:\s*([\d,]+)", text)
    data["lifespan_hours"] = m.group(1).replace(",", "") if m else ""

    # Warranty
    m = re.search(r"(\d+)\s*Year", text, re.IGNORECASE)
    data["Warranty_years"] = m.group(1) if m else ""

    # Certifications - IP rating + DLC if mentioned
    certs = []
    ip = re.search(r"(IP\d+)", text)
    if ip:
        certs.append(ip.group(1))
    if "DLC" in text:
        certs.append("DLC")
    data["Certifications"] = ", ".join(certs) if certs else ""

    return data


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_mammoth.py <spec_text_file>")
        print("  e.g. python parse_mammoth.py chat.txt")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split on "Legal Disclosure" to separate products
    blocks = re.split(r"Legal Disclosure:", text)
    # Each block except the last trailing bit contains one product
    # The product data is before each Legal Disclosure
    blocks = [b.strip() for b in blocks if b.strip() and re.search(r"Model", b, re.IGNORECASE)]

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for block in blocks:
        data = parse_mammoth(block)

        if not data["model"]:
            continue

        make = data["make"]
        model = data["model"]
        make_slug = "mammoth_lighting"
        model_slug = model.lower().replace(" ", "_").replace(",", "").replace("+", "")

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
            "pdf": data["pdf"],
        }

        with open(CSV_PATH, "a", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writerow(row)

        print(f"Added row {idx}: {make} - {model}")


if __name__ == "__main__":
    main()
