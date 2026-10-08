# Fonts

Pyidaungsu 2.053, the Burmese font for the seller app. It's the government-standard Myanmar Unicode font, made by the Myanmar Computer Federation (MCF) and released under the SIL Open Font License 1.1 (`OFL.txt`). That licence lets us host it and embed it in a commercial app; the font files themselves also allow embedding.

- `Pyidaungsu-Regular.woff2` and `Pyidaungsu-Bold.woff2`: what the app and docs load, through the `@font-face` rules at the top of `components/bundle.css`. They're the release files converted to WOFF2 without changing any glyphs, about 78 KB and 108 KB.
- `Pyidaungsu-2.5.3_Regular.ttf` and `Pyidaungsu-2.5.3_Bold.ttf`: the original release files, for Figma and other design tools.

The `@font-face` rules use the name "Pyidaungsu", so our copy replaces any older one installed on the phone, and every seller sees the same shapes. Their `unicode-range` covers Myanmar script only, so English-only screens never download it.

Source: the release folder `Pyidaungsu2.5.3/Release` in [mcfnlp/Pyidaungsu](https://github.com/mcfnlp/Pyidaungsu), MCF's own repository. The same files are linked from mcf.org.mm and mmunicode.org.mm. SHA-256 of the originals:

- Regular: `df7106c15da76f6a24c10821b43da51f54961f6bc6791fb1fcf21c6c60bb2e10`
- Bold: `6fd7f1d3f70c5cb9f663d46d7a940e18c2e9247acbed70ac8612239621586d8b`

"Pyidaungsu" is a trademark of MCF. Keep the name and the licence with the files, and don't sell the fonts on their own.
