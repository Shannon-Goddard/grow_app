# AC Infinity — Data Extraction

## Source

Product specifications were pulled from AC Infinity's product pages at [https://acinfinity.com](https://acinfinity.com). The PDF manuals did not contain the detailed spec tables needed, so the web product pages were used as the primary data source.

## Process

### 1. Copy/Paste from Product Pages

Each product page on acinfinity.com has a "Specifications" tab with a clean tab-separated table. That table was copy/pasted directly into `chat.txt`. Multiple products can be pasted into a single file separated by blank lines.

### 2. Automated Parsing with `parse_ac_infinity.py`

A dedicated parser was built for AC Infinity's tab-separated format.

**Usage:**
```bash
python parse_ac_infinity.py chat.txt
```

Supports multiple products in one file — each block separated by a blank line.

### Example Input

```
   Manufacturer	   AC Infinity Inc.
   Product Name	   IONFRAME EVO3
   Product Model	   AC-IF3K
   UPC Code	   819137024045
   Product and Mounting Dimensions
   Light Dimensions	   16.14 x 32.67 x 3.03 in. (41.0 x 83.0 x 7.7 cm)
   Product Performance and Technical Specs
   Coverage	   2 x 4 ft.
   Diodes	   Samsung LM301H EVO
   Spectrum	   395nm, 660nm, 730nm, 3000K, 5000K
   Efficiency (Single Diode)	   3.14 µmol/J
   PPFD	   1745 PPFD
   Wattage	   280 W
   Voltage	   100-277V AC
   Frequency	   50/60 Hz
   Operating Temperature	   32 to 140°F
   Waterproof Rating	   IP-65
   Life Expectancy	   50,000 Hours
```

### What the Parser Handles

| AC Infinity Field | CSV Column | Notes |
|-------------------|-----------|-------|
| Product Name | model | |
| Diodes + Spectrum | type | Combined into one string |
| PPFD | PPF | AC Infinity lists PPFD, not PPF |
| Efficiency (Single Diode) | efficacy_umol_joule | |
| Voltage | VAC_low / VAC_high | Parses "100-277V AC" |
| Frequency | Hz_low / Hz_high | Parses "50/60 Hz" |
| Wattage | max_Watts | |
| Coverage | flowering_footprint_length/width_ft | e.g. "2 x 4 ft." |
| Light Dimensions | dimensions_length/width/height_inches | |
| Operating Temperature | max_ambient_temperature_c/f | Extracts max °F, converts to °C |
| Controller | dimmable / Dimming Options | If "dimm" in controller name |
| Waterproof Rating | Certifications | |
| Life Expectancy | lifespan_hours | Strips commas |

### Fields Not Available from Web Specs

These are filled in manually where possible:
- Flowering/veg mounting heights
- Propagation heights
- Intensity percentages
- Weight
- Warranty
- PDF filename

## Why Web URLs Instead of PDFs

AC Infinity's downloadable PDF manuals are installation/usage guides — they don't contain the detailed technical specifications (PPF, efficacy, voltage range, etc.) that appear on the product web pages. The web spec tables are the authoritative source for this data.

## Contributing

To add a new AC Infinity light:

1. Go to the product page on [acinfinity.com](https://acinfinity.com)
2. Click the "Specifications" tab
3. Select and copy the entire spec table
4. Paste into `chat.txt` (separate multiple products with a blank line)
5. Run `python parse_ac_infinity.py chat.txt`
6. Spot-check the last row(s) in `lighting.csv`
7. Manually fill in any missing fields (weight, warranty, pdf, heights)
