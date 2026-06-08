(function (root) {
  "use strict";

  const HAMZA = "ء";

  const LETTERS = {
    а: "ا",
    ә: "ا",
    б: "ب",
    в: "ۆ",
    г: "گ",
    ғ: "ع",
    д: "د",
    е: "ە",
    ё: "يو",
    ж: "ج",
    з: "ز",
    и: "ي",
    й: "ي",
    к: "ك",
    қ: "ق",
    л: "ل",
    м: "م",
    н: "ن",
    ң: "ڭ",
    о: "و",
    ө: "و",
    п: "پ",
    р: "ر",
    с: "س",
    т: "ت",
    у: "ۋ",
    ұ: "ۇ",
    ү: "ۇ",
    ф: "ف",
    х: "ح",
    һ: "ح",
    ц: "تس",
    ч: "چ",
    ш: "ش",
    щ: "شش",
    ъ: "",
    ы: "ى",
    і: "ى",
    ь: "",
    э: "ە",
    ю: "يۋ",
    я: "يا",
  };

  const CYRILLIC_WORD = /[А-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі]+/g;
  const FRONT_VOWELS_NEEDING_MARK = /[ӘәӨөҮүІі]/;
  const FRONT_HINTS_WITHOUT_MARK = /[ЕеЭэКкГг]/;
  const BACK_INITIAL_WITHOUT_MARK = /^[ҚқҒғ]/;
  const PUNCTUATION = {
    ",": "،",
    ";": "؛",
    "?": "؟",
  };

  function convertWord(word) {
    let converted = "";

    for (const char of word) {
      const mapped = LETTERS[char.toLocaleLowerCase("kk-KZ")];
      converted += mapped === undefined ? char : mapped;
    }

    if (
      FRONT_VOWELS_NEEDING_MARK.test(word) &&
      !FRONT_HINTS_WITHOUT_MARK.test(word) &&
      !BACK_INITIAL_WITHOUT_MARK.test(word)
    ) {
      return HAMZA + converted;
    }

    return converted;
  }

  function kazakhCyrillicToArabic(text) {
    return text
      .replace(CYRILLIC_WORD, convertWord)
      .replace(/[,\;\?]/g, (mark) => PUNCTUATION[mark])
      .replace(
        /([\u0621-\u064A\u067E\u06AD\u06AF\u06C7\u06CB\u06D5])-\s+([\u0621-\u064A\u067E\u06AD\u06AF\u06C7\u06CB\u06D5])/g,
        "$1-$2"
      );
  }

  const api = {
    kazakhCyrillicToArabic,
    convertWord,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.KazakhConverter = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
