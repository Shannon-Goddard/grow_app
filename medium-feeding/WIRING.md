# medium-feeding — Wiring Logic Reference

## Current Status
- ✅ Step 1 — Strain search, localStorage written correctly
- ✅ Step 2 — Nutrient checkboxes, saves to localStorage + IDB
- ✅ Step 3 — Date picker, schedule saves to IndexedDB
- ✅ Success screen → links to `schedule-viewer.html`
- ✅ `schedule-viewer.html` — full schedule table + card view
- ✅ `mytask.html` — daily check-in, saves actuals to IDB
- ✅ `mydiary.html` — camera + column selector + data overlay

---

## File Structure

```
medium-feeding/
├── medium-feeding.html          ← 3-step grow builder (single page)
├── schedule-viewer.html         ← schedule table + card view
├── mytask.html                  ← daily check-in app
├── mydiary.html                 ← photo diary + data overlay
├── WIRING.md                    ← this file
└── assets/
    ├── js/
    │   ├── data.js              ← window.data global (2,800+ strains), plain script
    │   ├── strain-selector.js   ← step 1 logic
    │   ├── nutrient-selector.js ← step 2 logic
    │   ├── schedule-builder.js  ← step 3 logic (reads currentGrowId, never generates one)
    │   ├── schedule-generator.js← fetch + prepareSchedule + saveScheduleToIndexedDB
    │   ├── og-schedule-viewer.js← renders IDB schedule into #table1, fires tableRendered
    │   └── indexedDBService.js  ← DB: MyGrowDB v8, singleton instance export
    ├── css/
    │   ├── strain-search.css
    │   └── nutrient-selector.css
    ├── data/
    │   ├── schedule-data.json   ← 126 rows: stage/week/day/env/light/water fields
    │   └── nutrient-data.json   ← feeding schedules per brand
    ├── strain-img/              ← strain logos e.g. Green_Crack.jpg, default.jpg
    └── nutrient-img/            ← brand images e.g. foxfarms.png
```

---

## Page Flow

```
medium-feeding.html
  Step 1 (Strain) → strainSelected
  Step 2 (Nutrients) → nutrientsSelected
  Step 3 (Date) → scheduleReady → success screen
    → schedule-viewer.html?growId={growId}
      → mytask.html  (MyTask button)
      → mydiary.html (MyDiary button)
```

---

## medium-feeding.html

### CustomEvent Chain

| Event | Fired by | Listened in | Action |
|---|---|---|---|
| `strainSelected` | `strain-selector.js` | page inline script | `showStep(2)` |
| `nutrientsSelected` | `#nutrientTaskButton` click | page inline script | `showStep(3)` |
| `scheduleReady` | `schedule-builder.js` | page inline script | show `#step-success` |

### Step 2 Save Logic
The page handles nutrient save directly, bypassing `nutrient-selector.js` taskButton:
```javascript
document.getElementById('nutrientTaskButton').addEventListener('click', async () => {
  const growId = localStorage.getItem('currentGrowId');
  const selected = Array.from(
    document.querySelectorAll('.listPrint input[type="checkbox"]:checked')
  ).map(cb => cb.value || cb.id.replace('custom-', ''));
  localStorage.setItem('nutrients_' + growId, JSON.stringify(selected));
  // also save to IDB selectedNutrients store
  window.dispatchEvent(new CustomEvent('nutrientsSelected'));
});
```

### Step 3 — dateTaskButton
Directly imports and calls `schedule-generator.js` — no hidden `#taskButton` proxy:
```javascript
document.getElementById('dateTaskButton').addEventListener('click', async () => {
  const { saveScheduleToIndexedDB } = await import('./assets/js/schedule-generator.js');
  await saveScheduleToIndexedDB();
});
```

### Script Load Order
```html
<script src="jquery.min.js"></script>
<script defer src="lozad.min.js"></script>
<script src="../assets/js/hamburger.js"></script>
<script src="assets/js/data.js"></script>                    <!-- window.data global, must be plain -->
<script type="module" src="assets/js/strain-selector.js"></script>
<script type="module" src="assets/js/nutrient-selector.js"></script>
<script type="module" src="assets/js/schedule-builder.js"></script>
```
`data.js` must be a plain `<script>` so `window.data` is global before modules load.
`schedule-builder.js` is loaded but only reads `currentGrowId` — never generates a new one.

---

## schedule-viewer.html

### Layout Modes
Controlled by `localStorage.scheduleLayout`. Default: `cards` on mobile (≤768px), `table` on desktop.

| Mode | Button | What shows |
|---|---|---|
| `cards` | Cards | Collapsible day cards, table hidden |
| `table` | Table | Full horizontal-scroll table, cards hidden |
| `notes` | My Notes | Cards with editable My fields visible |

### Options Dropdown
Single `⚙ Options` button in toolbar opens a panel with three sections:
- **View** — Cards / Table / My Notes buttons
- **Plant Size** — Small / Medium / Large / Auto (+ days input for Auto)
- **Navigate** — MyTask / MyDiary links

Closes on outside click. All button IDs unchanged so JS logic is unaffected.

### Toolbar Sticky
- `header`: `position: sticky; top: 0; z-index: 50`
- `.toolbar`: `position: sticky; top: 57px; z-index: 40`
- `thead th`: `position: sticky; top: 112px; z-index: 10`
- `body` has `overflow-x: auto` (not `.table-wrap`) so sticky thead works against page scroll

### og-schedule-viewer.js
- Imports `IndexedDBService` instance from `./indexedDBService.js`
- Reads `growId` from URL param first, then `localStorage.currentGrowId`
- Renders full table into `#table1` with all columns
- Fires `document.dispatchEvent(new CustomEvent('tableRendered'))` when done
- Sets `row.dataset.stage` for CSS color coding
- Exposes `window.loadAndRenderTable` and `window.showToast`

### Table Column Index Map (0-based)
```
0  MyGrow          1  Date             2  Stage            3  Week
4  Day             5  Visual Inspect   6  My Notes*        7  Amount of Water
8  pH Goal         9  My pH*           10 Light Intensity  11 My Light Intensity*
12 Light Distance  13 My Light Dist*   14 Daytime Temp     15 My Daytime Temp*
16 Nighttime Temp  17 My Night Temp*   18 Hours of Light   19 Humidity
20 My Humidity*    21 Air Fan Position 22 My Fan Position*
23+ [Nutrient]     24+ [My Nutrient]*  (pairs, dynamic)
```
`*` = My col, hidden in Schedule/Cards mode, shown in My Notes mode.
`MY_COL_INDICES = [6, 9, 11, 13, 15, 17, 20, 22]` + even indices ≥ 24.

### My Notes — All Editable Fields
Cards My Notes mode and table My Notes mode both cover:
- **My Environment**: `actual_ph`, `actual_dt_temp`, `actual_nt_temp`, `actual_humidity`
- **My Light & Air**: `actual_light_intensity`, `actual_light_distance`, `actual_fan_position`
- **My Nutrients**: `actual_nutrient_${key}` — one per selected nutrient (dynamic)
- **My Inspection Notes**: `actual_inspection_notes`

These match exactly what `mytask.html` saves, so data is shared between both pages.

### Plant Size Filter
Hides vegetative rows beyond max veg weeks. Works on both table and cards.

| Size | Max Veg Weeks |
|---|---|
| Small | 4 |
| Medium | 6 |
| Large / Auto | all |

Size preference saved to `localStorage.plantSize` and `localStorage.plantSize_{growId}`.

### tableRendered Event Flow
1. `og-schedule-viewer.js` renders table → fires `tableRendered`
2. Inline script catches it → loads schedule from IDB → caches as `_scheduleData`
3. Reads nutrient keys from first schedule row with nutrients
4. Reads nutrient display names from rendered `thead th` (indices 23, 25, 27...)
5. Calls `setLayout(currentLayout)` → renders cards or applies table mode
6. Calls `filterBySize(size)` → hides rows per plant size

---

## mytask.html

Daily check-in. Loads today's schedule row (matched by date string `MM/DD/YYYY`), falls back to row 0.

### Sections
- **Hero image** — upload + compress to 800px JPEG, saved to `localStorage.taskImage_{growId}`
- **Environmental Targets** — shows goals, inputs for actuals
- **Water & Nutrients** — shows scheduled amounts, inputs for actuals (dynamic per selected nutrients)
- **Light & Air Flow** — shows targets, inputs for actuals
- **Visual Inspection** — shows tip, textarea for notes

### Save Behavior
- `Log Today's Check` button → saves actuals to `localStorage.taskActuals_{growId}_{date}` AND writes back to IDB schedule row
- `focusout` on any input → auto-saves same way
- Color coding on numeric inputs: green = within 10% of goal, red = over, blue = under

### Fields Saved to IDB Schedule Row
`actual_ph`, `actual_dt_temp`, `actual_nt_temp`, `actual_humidity`, `actual_light_intensity`, `actual_light_distance`, `actual_fan_position`, `actual_inspection_notes`, `actual_nutrient_${key}` (one per selected nutrient)

---

## mydiary.html

Photo diary with data overlay. Dark theme.

- Camera capture or file upload
- Column selector — choose which schedule fields to overlay on photo
- Saves diary entries to IDB
- Back → `schedule-viewer.html`, MyTask → `mytask.html`

---

## IndexedDB — MyGrowDB v8

Singleton instance exported as named export:
```javascript
import { IndexedDBService } from './indexedDBService.js';
```
All methods are **instance methods**, not static. `dbPromise` is cached to prevent multiple connections.

### Stores

| Store | keyPath | Usage |
|---|---|---|
| `tables` | `id` | `{ id: growId, type:'grow', growName, strain, logo }` and `{ id: '${growId}_schedule', data: [...] }` |
| `selectedNutrients` | `id` | `{ id: growId, nutrients: ['foxfarm-grow', ...] }` |
| `nutrients` | `nutrientName` | custom nutrient objects |

### Key Methods
| Method | Description |
|---|---|
| `saveSchedule(growId, array)` | saves under key `${growId}_schedule` |
| `loadSchedule(growId)` | loads array from key `${growId}_schedule` |
| `loadAllGrows()` | returns all records whose key contains `_schedule` |
| `initDB()` | returns cached db Promise |

---

## localStorage Keys

| Key | Written by | Value |
|---|---|---|
| `currentGrowId` | `strain-selector.js` | `grow_${Date.now()}` |
| `growName_{growId}` | `strain-selector.js` | grow name string |
| `plantStrain_{growId}` | `strain-selector.js` | strain name |
| `plantLogo_{growId}` | `strain-selector.js` | `assets/strain-img/filename.jpg` |
| `plantGrow_{growId}` | `strain-selector.js` | `{ floweringWeeks: N }` |
| `plantSize_{growId}` | `strain-selector.js` | `auto` / `small` / `medium` / `large` |
| `isAuto_{growId}` | `strain-selector.js` | `'true'` / `''` |
| `seedToHarvest_{growId}` | `strain-selector.js` | days string (autos only) |
| `nutrients_{growId}` | page `nutrientTaskButton` handler | JSON array of nutrient IDs |
| `startDate` | `schedule-builder.js` | ISO date string |
| `floweringWeeks_{growId}` | `schedule-builder.js` | number |
| `vegWeeks_{growId}` | `schedule-builder.js` | number |
| `scheduleLayout` | `schedule-viewer.html` | `'cards'` / `'table'` / `'notes'` |
| `plantSize` | `schedule-viewer.html` | `'small'` / `'medium'` / `'large'` / `'auto'` |
| `taskImage_{growId}` | `mytask.html` | base64 JPEG data URL |
| `taskActuals_{growId}_{date}` | `mytask.html` | JSON object of actual field values |

---

## Unused JS Files in assets/js/

These files exist in `medium-feeding/assets/js/` but are **not loaded by any live page**. They are legacy from the old `mygrow/` multi-page architecture and can be deleted safely.

| File | Why unused |
|---|---|
| `grow-manager.js` | Old mygrow dashboard manager. References `/mygrow/assets/img/` paths and `/mygrow/schedule-viewer/schedule-viewer.html`. Replaced by `og-schedule-viewer.js`. |
| `nutrient-data-loader.js` | Fetches from `../../mygrow/build-your-guide/nutrient-data.json` — path no longer exists. Replaced by `schedule-generator.js` fetch. |
| `nutrient-display.js` | Fetches from `/mygrow/schedule-builder/nutrient-data.json` — path no longer exists. |
| `nutrient-manager.js` | Old nutrient step logic. Replaced by `nutrient-selector.js` + inline page handler. |
| `schedule-viewer.js` | Old schedule viewer. Replaced by `og-schedule-viewer.js`. |
| `grow-selector.js` | Old grow dropdown logic. Replaced by inline `populateDropdown()` in `og-schedule-viewer.js`. |
| `table-renderer.js` | Old table rendering. Replaced by `og-schedule-viewer.js`. |
| `table-editable.js` | Old click-to-edit logic. Replaced by inline `attachTableEditing()` in `schedule-viewer.html`. |
| `table-editor.js` | Duplicate/variant of `table-editable.js`. Not loaded anywhere. |
| `plant-size-filter.js` | Old size filter. Replaced by inline `filterBySize()` in `schedule-viewer.html`. |
| `plant-config.js` | Old plant config helper. Superseded by localStorage keys written in `strain-selector.js`. |
| `date-manager.js` | Old date step logic. Superseded by `schedule-builder.js`. |
| `date-manager-2.js` | Variant of `date-manager.js`. Not loaded anywhere. |
| `toast.js` | Old toast helper. Replaced by inline `showToast()` in `og-schedule-viewer.js`. |

---

## Fetch Paths in schedule-generator.js

Absolute paths used because ES module fetch resolves relative to the JS file:
```javascript
fetch('/medium-feeding/assets/data/schedule-data.json')
fetch('/medium-feeding/assets/data/nutrient-data.json')
```
Works when server root is repo root (`growappcannabis.guide/`), served via `server.py` on port 8000.

---

## Image Paths

All paths relative to `medium-feeding/` (the page root).

| Context | Path |
|---|---|
| Strain logos | `assets/strain-img/Green_Crack.jpg` |
| Fallback logo | `assets/strain-img/default.jpg` |
| Random defaults (custom strain) | `assets/strain-img/default-1.png` → `default-15.png` |
| Nutrient brand images | `assets/nutrient-img/foxfarms.png` |

`pot-image.png` does NOT exist — use `default.jpg` as fallback.
`../strain-img/` is WRONG — resolves to site root `/strain-img/` which doesn't exist.

---

## Dark Theme Tokens

| Token | Value |
|---|---|
| Background | `#0a0c0e` |
| Surface | `#13181d` |
| Border | `#2a333d` |
| Brand green | `#04AA6D` |
| Brand dark | `#038a57` |
| Muted text | `#8b949e` |
| Body text | `#e8eaed` |
