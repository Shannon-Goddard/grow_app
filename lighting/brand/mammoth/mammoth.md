# Mammoth Lighting — Data Extraction

## Source

Product specifications were extracted from Mammoth Lighting's 2026 spec sheet PDF (`2026_Spec_Sheet.pdf`), downloaded from [https://mammothlighting.com](https://mammothlighting.com).

## Process

### 1. PDF Copy/Paste

The spec sheet PDF uses a two-column layout that copy/pastes in a jumbled, non-linear order. Key-value pairs end up interleaved with amperage tables, feature bullet points, and legal disclaimers. All 6 products are in a single PDF.

### 2. Automated Parsing with `parse_mammoth.py`

A dedicated parser was built to handle Mammoth's chaotic PDF layout.

**Usage:**
```bash
python parse_mammoth.py chat.txt
```

The parser splits products on `Legal Disclosure:` (which appears at the end of each product block) and extracts data using targeted regex patterns.

### What the Parser Extracts

| Data Point | How It's Found |
|-----------|---------------|
| Model | Text after "Model" line |
| PPF | First `X,XXX μmol/s` value |
| Efficacy | `X.X μmol/J` pattern |
| Power | `Xw Total` or standalone `Xw` after Power label |
| Voltage | `120-277V` pattern |
| Frequency | `50/60 Hz` pattern |
| Coverage | `Veg: XxX` and `Flower: XxX` |
| Dimensions | `XX" X XX" X X"` pattern |
| Weight | First `XX lbs` value |
| Lifespan | `L90: XX,XXX` pattern |
| Dimming | Text after "Dimming" label |
| Warranty | `X Year` pattern |
| Certifications | IP rating + DLC if mentioned |

### Manual Corrections Required

The parser got 5 of 6 products but needed manual fixes:

- **3 Channel, 8 Bar Nova Sun** — PPF grabbed partial channel value (1750) instead of total (2470). Corrected manually.
- **8 Bar, 6 Bar, 6 Bar Veg+Mom, Greenhouse** — Power (watts) not captured because the PDF doesn't use "Total" suffix on standalone models. Corrected manually.
- **Multi-Use Bars** — Could not be parsed automatically. This product lists 3 different configurations (2-bar 300w, 4-bar 600w, 8-bar 1200w) in a single block with shared specs. Had to do math to break it down to single-bar measurements and enter manually.

### Why This Brand Is Messy

Mammoth puts all their products on a single spec sheet PDF with a two-column layout. When copy/pasted:
- Column headers and values get interleaved
- Amperage tables (120V, 208V, 240V, 277V, 347V, 480V) break up the flow
- Feature bullet points appear mid-data
- The "Legal Disclosure" boilerplate repeats after each product

Despite the chaos, the consistent structure (same labels, same order) made automated extraction possible for most products.

## Contributing

To add a new Mammoth light:

1. Copy/paste the product's section from their spec sheet PDF into `chat.txt`
2. Make sure the `Legal Disclosure:` text is included at the end (it's the block separator)
3. Run `python parse_mammoth.py chat.txt`
4. Spot-check and fix PPF (watch for partial channel values) and wattage
5. The Multi-Use Bars style products with multiple configs will need manual entry
