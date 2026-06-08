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

  // Reverse mapping: Arabic-script Kazakh -> Cyrillic.
  // If a word is preceded by ء (hamza), the soft (front) vowel variants
  // are used for ambiguous letters; otherwise the back variants.
  const ARABIC_TO_CYR_HARD = {
    "ا": "а",
    "ب": "б",
    "پ": "п",
    "ت": "т",
    "ج": "ж",
    "چ": "ч",
    "ح": "х",
    "د": "д",
    "ر": "р",
    "ز": "з",
    "س": "с",
    "ش": "ш",
    "ع": "ғ",
    "ف": "ф",
    "ق": "қ",
    "ك": "к",
    "گ": "г",
    "ل": "л",
    "م": "м",
    "ن": "н",
    "ڭ": "ң",
    "و": "о",
    "ۆ": "в",
    "ۇ": "ұ",
    "ۋ": "у",
    "ي": "и",
    "ى": "ы",
    "ھ": "һ",
    "ٶ": "ө",
    "ٷ": "ү",
    "ٵ": "ә",
  };
  const ARABIC_TO_CYR_SOFT = {
    ...ARABIC_TO_CYR_HARD,
    "ا": "ә",
    "و": "ө",
    "ۇ": "ү",
    "ى": "і",
  };
  const REVERSE_PUNCTUATION = {
    "،": ",",
    "؛": ";",
    "؟": "?",
  };
  const ARABIC_WORD =
    /[\u0621-\u064A\u067E\u06AD\u06AF\u06C7\u06CB\u06D5\u0674\u0676\u0675]+/g;

  function convertArabicWord(word) {
    let soft = false;
    let stripped = word;
    if (stripped.startsWith(HAMZA)) {
      soft = true;
      stripped = stripped.slice(1);
    }
    // If word contains explicit soft-vowel hamza-marked letters, treat as soft.
    if (/[\u0674\u0675\u0676\u06CB]/.test(stripped) || /ٵ|ٶ|ٷ/.test(stripped)) {
      soft = true;
    }
    const table = soft ? ARABIC_TO_CYR_SOFT : ARABIC_TO_CYR_HARD;
    let out = "";
    for (const ch of stripped) {
      out += table[ch] !== undefined ? table[ch] : ch;
    }
    // Capitalize if the original word looked initial (we don't track case for Arabic);
    return out;
  }

  function arabicToKazakhCyrillic(text) {
    return text
      .replace(ARABIC_WORD, convertArabicWord)
      .replace(/[،؛؟]/g, (mark) => REVERSE_PUNCTUATION[mark] || mark);
  }

  const api = {
    kazakhCyrillicToArabic,
    arabicToKazakhCyrillic,
    convertWord,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.KazakhConverter = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
