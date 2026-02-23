# Galaxy ARK Shop

Static storefront for ARK items, designed to run directly on GitHub Pages.

## Project Structure

```
.
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── data/
│   │   └── cards.json
│   └── js/
│       └── main.js
└── img/
    ├── currency/
    ├── dossiers/
    └── stats/
```

## Editing Content

- Add or update cards in `assets/data/cards.json`.
- Update styling in `assets/css/styles.css`.
- Update behavior in `assets/js/main.js`.
- Keep image paths relative (for example: `./img/dossiers/mantis.png`) to stay GitHub Pages-compatible.

## GitHub Pages Compatibility

- No build step is required.
- Entry point remains `index.html` at the repository root.
- All links use relative paths, so this works for both:
  - user/organization pages (`https://username.github.io/`)
  - project pages (`https://username.github.io/repository-name/`)

## Local Preview

You can open `index.html` directly, but using a local server is recommended for consistent fetch behavior:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
