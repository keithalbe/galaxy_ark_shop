# Import Dino Screenshots

Read every PNG in `to_add/` and update `assets/data/cards.json` with the extracted stats. Follow all rules below exactly.

## Step 1 — Discover screenshots

List all `.png` files in `to_add/`. Each file is a screenshot from ARK Smart Breeding showing a single creature's stats.

## Step 2 — Read each screenshot

Use the Read tool on each image. Extract:

**From the title bar (top of the screenshot):**
- **Variant prefix**: the word(s) before the creature name (e.g. "ARKOLOGY", "ABERRANT"). If there is no prefix before the name, the variant is "Base".
- **Creature name**: the main species name in the title (e.g. "ANKYLOSAURUS", "BARYONYX").
- **Level**: the number after "LVL" (e.g. "LVL 362" → 362).

**From the stat rows (numbered points invested, NOT the actual HP/damage values):**

The left column contains rows with these icons in order:
1. ✚ cross → **Health**
2. ⚡ lightning bolt → **Stamina**
3. 🍼 bottle/droplet → Oxygen (ignore this)
4. 🪶 feather/weight icon → **Weight**
5. ☽ crescent moon → Torpor (ignore this)

The right column contains:
1. 🥩 meat icon → **Food**
2. 👊 fist icon → **Melee**

Each row shows a small number (the stat points) followed by two orange circles and then the actual value bar. Use the **small number at the left of each row** — that is the points-invested value to record.

The five stats to record are: **Health, Stamina, Food, Weight, Melee**.

## Step 3 — Match to existing entries in cards.json

Read `assets/data/cards.json`. For each screenshot:

- **If an entry with the same creature name already exists**: update its `level` and `stats` with the new values. Leave `description`, `variants`, `costs`, and `image` unchanged.
- **If no entry exists**: add a new entry (see Step 4).

Name matching is case-insensitive and handles common short forms:
- "BARY" or "BARYONYX" → "Baryonyx"
- "ANKY" or "ANKYLOSAURUS" → "Ankylosaurus"
- "BASILO" or "BASILOSAURUS" → "Basilosaurus"
- "BRONTO" or "BRONTOSAURUS" → "Brontosaurus"
- "CARNO" or "CARNOTAURUS" → "Carnotaurus"
- Otherwise, title-case the name as-is.

## Step 4 — New entry format

For creatures with no existing entry, create:

```json
{
  "name": "<Title-cased creature name>",
  "category": "dinosaur",
  "level": <number>,
  "description": "<see description rules below>",
  "image": "./img/dossiers/<lowercase_name>.webp",
  "variants": ["<variant>"],
  "costs": {
    "Element": 350
  },
  "stats": {
    "Health": <number>,
    "Stamina": <number>,
    "Food": <number>,
    "Weight": <number>,
    "Melee": <number>
  }
}
```

**Image path rules:**
- Lowercase the creature name
- Replace spaces with underscores
- Use `.webp` extension
- Example: "Snow Owl" → `./img/dossiers/snow_owl.webp`

**Variant rules** (from title bar prefix):
- "ARKOLOGY ..." → `["Arkology"]`
- "ABERRANT ..." → `["Aberrant"]`
- No prefix → `["Base"]`

**Cost:** default to `{ "Element": 350 }` for all new entries.

## Step 5 — Descriptions for new entries

Write a short (one sentence, under 20 words) description that is witty but technically accurate. It should highlight what the creature is *mechanically useful for* in ARK — its primary gameplay role, a standout ability, or a unique mechanic.

Study these existing examples for tone and style:
- Mantis: "Tool-wielding bug mercenary. Great for harvesting or slaughtering."
- Sarco: "Lightning-fast swimmer; zero oxygen stat needed, massive water stamina, and deadly river ambusher."
- Kaprosuchus: "Leaping ambusher; dismounts riders with surprise grabs and thrives in swamp hit-and-run chaos."
- Hyaenodon: "Walking meat storage; 8x meat spoil time, and 60% meat weight reduction."
- Daeodon: "Mobile medic; enable passive healing (or use active while riding) which consumes food to heal nearby allies, invaluable for boss fights."

Rules:
- Lead with a vivid noun phrase that captures the creature's identity
- Follow with the mechanical value (what it does, what resource it farms, what combat role it fills)
- No filler words; no "it is great for" — just state the fact
- Do NOT write a description for entries that already exist in cards.json (leave them as-is)

## Step 6 — Write the file

Write the complete updated `assets/data/cards.json`. Preserve all existing entries that do not correspond to a screenshot. Append new entries at the end.

After writing, report:
- Which entries were **updated** (name + what changed)
- Which entries were **added** (name + level)
- Which screenshots were **skipped** (if any, and why)
