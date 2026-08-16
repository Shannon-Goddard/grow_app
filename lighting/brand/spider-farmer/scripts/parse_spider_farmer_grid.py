import csv
import re
import sys
import os

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lighting.csv")

# cm to feet conversion (rounded to nearest 0.5)
def cm_to_ft(cm):
    ft = float(cm) / 30.48
    # Round to nearest 0.5
    return str(round(ft * 2) / 2)


def parse_grid(text):
    """Parse Spider Farmer grid-format comparison table."""
    # Split into lines, filter blanks
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]

    # Detect row categories and their positions
    categories = ["LED", "Wattage", "PPF", "PPE", "Coverage", "Dimmable"]

    # Find model names - they come before the first category
    models = []
    cat_data = {}
    current_cat = None
    cat_values = []

    for line in lines:
        # Check if this line is a category header
        is_cat = False
        for cat in categories:
            if line.upper() == cat.upper() or line.upper().startswith(cat.upper()):
                if current_cat and cat_values:
                    cat_data[current_cat] = cat_values
                current_cat = cat
                cat_values = []
                is_cat = True
                break

        if not is_cat:
            if current_cat is None:
                # Before any category = model names
                models.append(line)
            else:
                cat_values.append(line)

    # Don't forget last category
    if current_cat and cat_values:
        cat_data[current_cat] = cat_values

    num_models = len(models)
    if num_models == 0:
        return []

    # Build product list
    products = []
    for i in range(num_models):
        data = {}
        data["dba"] = "Spider Farmer"
        data["make"] = "Spider Farmer"
        data["model"] = models[i]
        data["pdf"] = ""

        # LED type
        leds = cat_data.get("LED", [])
        led_val = leds[i] if i < len(leds) else ""
        data["type"] = f"LED {led_val}" if led_val else ""

        # Wattage - extract number from "100W ±5% @AC100-277V"
        watts = cat_data.get("Wattage", [])
        watt_str = watts[i] if i < len(watts) else ""
        m = re.search(r"(\d+)\s*W", watt_str, re.IGNORECASE)
        data["max_Watts"] = m.group(1) if m else ""

        # Voltage from wattage string
        vm = re.search(r"AC(\d+)\s*[-V]\s*(\d+)\s*V", watt_str, re.IGNORECASE)
        if vm:
            data["VAC_low"] = vm.group(1)
            data["VAC_high"] = vm.group(2)
        else:
            data["VAC_low"] = data["VAC_high"] = ""

        # PPF
        ppfs = cat_data.get("PPF", [])
        ppf_str = ppfs[i] if i < len(ppfs) else ""
        m = re.search(r"([\d.]+)", ppf_str)
        data["PPF"] = m.group(1) if m else ""

        # Efficacy (PPE)
        ppes = cat_data.get("PPE", [])
        ppe_str = ppes[i] if i < len(ppes) else ""
        m = re.search(r"([\d.]+)", ppe_str)
        data["efficacy_umol_joule"] = m.group(1) if m else ""

        # Coverage - could be cm (60×60cm) or ft (2'x2')
        covs = cat_data.get("Coverage", [])
        cov_str = covs[i] if i < len(covs) else ""

        # Try cm format first: "60×60cm" or "60x60cm"
        m = re.search(r"([\d.]+)\s*[×xX]\s*([\d.]+)\s*cm", cov_str)
        if m:
            data["flowering_footprint_length_ft"] = cm_to_ft(m.group(1))
            data["flowering_footprint_width_ft"] = cm_to_ft(m.group(2))
        else:
            # Try ft format: "2'x2'" or "2 x 2 ft"
            m = re.search(r"([\d.]+)['']\s*[×xX]\s*([\d.]+)", cov_str)
            if m:
                data["flowering_footprint_length_ft"] = m.group(1)
                data["flowering_footprint_width_ft"] = m.group(2)
            else:
                data["flowering_footprint_length_ft"] = data["flowering_footprint_width_ft"] = ""

        data["veg_footprint_length_ft"] = ""
        data["veg_footprint_width_ft"] = ""

        # Dimmable
        dims = cat_data.get("Dimmable", [])
        dim_val = dims[i] if i < len(dims) else ""
        if dim_val in ("√", "✓", "Yes", "yes", "TRUE"):
            data["dimmable"] = "TRUE"
        else:
            data["dimmable"] = "FALSE"
        data["Dimming Options"] = ""

        # Empty fields
        data["Hz_low"] = ""
        data["Hz_high"] = ""
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
        data["dimensions_length_inches"] = ""
        data["dimensions_width_inches"] = ""
        data["dimensions_height_inches"] = ""
        data["weight_lb"] = ""
        data["lifespan_hours"] = ""
        data["Warranty_years"] = ""
        data["Certifications"] = ""

        products.append(data)

    return products


def next_index(csv_path):
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        indices = [int(row["index"]) for row in reader if row["index"].isdigit()]
    return f"{max(indices) + 1:05d}" if indices else "00001"


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_spider_farmer_grid.py <spec_text_file>")
        print("  e.g. python parse_spider_farmer_grid.py chat.txt")
        sys.exit(1)

    spec_file = sys.argv[1]

    with open(spec_file, "r", encoding="utf-8") as f:
        text = f.read()

    products = parse_grid(text)

    if not products:
        print("No products found.")
        sys.exit(1)

    # Read existing headers
    with open(CSV_PATH, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

    for data in products:
        model = data["model"]
        make_slug = "spider_farmer"
        model_slug = model.lower().replace(" ", "_")

        idx = next_index(CSV_PATH)

        row = {
            "index": idx,
            "dba": data["dba"],
            "make": data["make"],
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

        print(f"Added row {idx}: Spider Farmer {model} | PPF:{data['PPF']} | {data['max_Watts']}W | {data['efficacy_umol_joule']} umol/J | Flower:{data['flowering_footprint_length_ft']}x{data['flowering_footprint_width_ft']}")


if __name__ == "__main__":
    main()
