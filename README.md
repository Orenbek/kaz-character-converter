# Kazakh Character Converter

A small static page for Kazakh Arabic-script tools.

Live page: https://kaz-character-converter.pages.dev/#converter

- Kazakh Character Converter: converts Kazakh Cyrillic text to Arabic-script
  Kazakh.
- 哈萨克输入: types Kazakh Arabic characters from a QWERTY keyboard and shows the
  key map.

Open `index.html` in a browser, or run a tiny local server:

```sh
python3 -m http.server 5173
```

The converter is local JavaScript and does not call the original KazakhSoft
service. The transliteration table follows the Kazakh Cyrillic / Arabic
correspondence used by public Kazakh script converters and adds word-level
front-vowel hamza handling. The Arabic input key map follows the public
KazakhSoft `KeyKz` mapping.
