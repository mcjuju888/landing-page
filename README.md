# Belvoro for HVAC: landing page

Single static page with no build step and no runtime dependencies.

## Edit copy and links

Everything lives in `src/content.js`:

- `VIDEO_URL`: YouTube, Vimeo or `.mp4` link. The embed loads only when someone clicks play.
- `BOOKING_URL`: Cal.com or Calendly link, shown inline in the `#book` section.
- `CONTACT_EMAIL`, headings, channel labels and calculator configs.

Leave either URL empty to show its placeholder.

## Run locally

```sh
npm start        # serves the folder on http://localhost:3000
npm test         # calculator math (recovered <= leak), copy rules, embed parsing
```

The calculator selects its config through the `industry` option passed to
`mountCalculator` (the page passes `'hvac'`). If no option is passed, it reads
`?industry=` from the URL and then falls back to `DEFAULT_INDUSTRY`.
