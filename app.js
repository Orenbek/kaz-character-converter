(function () {
  "use strict";

  const sourceText = document.querySelector("#sourceText");
  const resultText = document.querySelector("#resultText");
  const sourceLabel = document.querySelector("#sourceLabel");
  const resultLabel = document.querySelector("#resultLabel");
  const modeChipFrom = document.querySelector("#modeChipFrom");
  const modeChipTo = document.querySelector("#modeChipTo");
  const characterCount = document.querySelector("#characterCount");
  const sourceMeta = document.querySelector("#sourceMeta");
  const resultMeta = document.querySelector("#resultMeta");
  const sampleButton = document.querySelector("#sampleButton");
  const clearButton = document.querySelector("#clearButton");
  const swapButton = document.querySelector("#swapButton");
  const copyButton = document.querySelector("#copyButton");
  const arabicInput = document.querySelector("#arabicInput");
  const arabicCount = document.querySelector("#arabicCount");
  const arabicMeta = document.querySelector("#arabicMeta");
  const clearArabicButton = document.querySelector("#clearArabicButton");
  const copyArabicButton = document.querySelector("#copyArabicButton");
  const keyboardMap = document.querySelector("#keyboardMap");
  const themeToggle = document.querySelector("#themeToggle");
  const toast = document.querySelector("#toast");

  const physicalKeyMap = [
    [
      { key: "`", normal: "`", shiftKey: "~", shift: "~" },
      { key: "1", normal: "1", shiftKey: "!", shift: "!" },
      { key: "2", normal: "2", shiftKey: "@", shift: "@" },
      { key: "3", normal: "3", shiftKey: "#", shift: "#" },
      { key: "4", normal: "4", shiftKey: "$", shift: "$" },
      { key: "5", normal: "5", shiftKey: "%", shift: "%" },
      { key: "6", normal: "6", shiftKey: "^", shift: "^" },
      { key: "7", normal: "7", shiftKey: "&", shift: "&" },
      { key: "8", normal: "8", shiftKey: "*", shift: "*" },
      { key: "9", normal: "9", shiftKey: "(", shift: ")" },
      { key: "0", normal: "0", shiftKey: ")", shift: "(" },
      { key: "-", normal: "-", shiftKey: "_", shift: "_" },
      { key: "=", normal: "=", shiftKey: "+", shift: "+" },
    ],
    [
      { key: "q", normal: "چ", shiftKey: "Q", shift: "چ" },
      { key: "w", normal: "ۋ", shiftKey: "W", shift: "ۋ" },
      { key: "e", normal: "ء", shiftKey: "E", shift: "ء" },
      { key: "r", normal: "ر", shiftKey: "R", shift: "ر" },
      { key: "t", normal: "ت", shiftKey: "T", shift: "ت" },
      { key: "y", normal: "ي", shiftKey: "Y", shift: "ي" },
      { key: "u", normal: "ۇ", shiftKey: "U", shift: "ٷ" },
      { key: "i", normal: "ڭ", shiftKey: "I", shift: "ڭ" },
      { key: "o", normal: "و", shiftKey: "O", shift: "ٶ" },
      { key: "p", normal: "پ", shiftKey: "P", shift: "پ" },
      { key: "[", normal: "]", shiftKey: "{", shift: "}" },
      { key: "]", normal: "[", shiftKey: "}", shift: "{" },
      { key: "\\", normal: "\\", shiftKey: "|", shift: "|" },
    ],
    [
      { key: "a", normal: "ھ", shiftKey: "A", shift: "ٵ" },
      { key: "s", normal: "س", shiftKey: "S", shift: "س" },
      { key: "d", normal: "د", shiftKey: "D", shift: "د" },
      { key: "f", normal: "ا", shiftKey: "F", shift: "ف", home: true },
      { key: "g", normal: "ە", shiftKey: "G", shift: "گ" },
      { key: "h", normal: "ى", shiftKey: "H", shift: "ح" },
      { key: "j", normal: "ق", shiftKey: "J", shift: "ج", home: true },
      { key: "k", normal: "ك", shiftKey: "K", shift: "ك" },
      { key: "l", normal: "ل", shiftKey: "L", shift: "ل" },
      { key: ";", normal: "؛", shiftKey: ":", shift: ":" },
      { key: "'", normal: "'", shiftKey: '"', shift: '"' },
    ],
    [
      { key: "z", normal: "ز", shiftKey: "Z", shift: "ز" },
      { key: "x", normal: "ش", shiftKey: "X", shift: "ش" },
      { key: "c", normal: "ع", shiftKey: "C", shift: "ع" },
      { key: "v", normal: "ۆ", shiftKey: "V", shift: "ۆ" },
      { key: "b", normal: "ب", shiftKey: "B", shift: "ب" },
      { key: "n", normal: "ن", shiftKey: "N", shift: "ن" },
      { key: "m", normal: "م", shiftKey: "M", shift: "م" },
      { key: ",", normal: "،", shiftKey: "<", shift: "»" },
      { key: ".", normal: ".", shiftKey: ">", shift: "«" },
      { key: "/", normal: "/", shiftKey: "?", shift: "؟" },
    ],
  ];

  const arabicKeyMap = physicalKeyMap.flat().reduce((map, item) => {
    map[item.key] = item.normal;
    map[item.shiftKey] = item.shift;
    return map;
  }, {});

  /* ---------- Helpers ---------- */
  function insertAtSelection(textarea, value) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value =
      textarea.value.slice(0, start) + value + textarea.value.slice(end);
    const nextPosition = start + value.length;
    textarea.setSelectionRange(nextPosition, nextPosition);
  }

  function countWords(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  let toastTimer = null;
  function showToast(message, variant) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("toast--error");
    if (variant === "error") {
      toast.classList.add("toast--error");
    }
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  /* ---------- Converter view ---------- */
  // direction: "c2a" = Cyrillic -> Arabic (default), "a2c" = Arabic -> Cyrillic
  let direction = "c2a";

  const SAMPLES = {
    c2a: `қазақша жәзуін кириллшә жәзуінә өзәрә сәикәстіру`,
    a2c: `قازاقشا جازۋىن كيريللشە جازۋىنا ءوزارا سايكەستىرۋ`,
  };

  function applyDirection() {
    const isC2A = direction === "c2a";
    if (isC2A) {
      modeChipFrom.textContent = "Қазақ кирилл";
      modeChipFrom.removeAttribute("dir");
      modeChipTo.textContent = "توتە جازۋ";
      modeChipTo.setAttribute("dir", "rtl");
      sourceLabel.textContent = "Input · Cyrillic";
      resultLabel.textContent = "Output · Arabic";
      sourceText.removeAttribute("dir");
      resultText.setAttribute("dir", "rtl");
      sourceText.placeholder = "Сәлем әлем — мұнда жазыңыз...";
      resultText.placeholder = "ءنەتيجە مۇندا كورىنەدى";
    } else {
      modeChipFrom.textContent = "توتە جازۋ";
      modeChipFrom.setAttribute("dir", "rtl");
      modeChipTo.textContent = "Қазақ кирилл";
      modeChipTo.removeAttribute("dir");
      sourceLabel.textContent = "Input · Arabic";
      resultLabel.textContent = "Output · Cyrillic";
      sourceText.setAttribute("dir", "rtl");
      resultText.removeAttribute("dir");
      sourceText.placeholder = "مۇندا جازىڭىز...";
      resultText.placeholder = "Нәтиже мұнда көрінеді";
    }
  }

  function convert(value) {
    if (direction === "c2a") {
      return window.KazakhConverter.kazakhCyrillicToArabic(value);
    }
    return window.KazakhConverter.arabicToKazakhCyrillic(value);
  }

  function render() {
    const value = sourceText.value;
    resultText.value = convert(value);
    const chars = value.length;
    const words = countWords(value);
    sourceMeta.textContent = `${chars} chars · ${words} words`;
    resultMeta.textContent = `${resultText.value.length} chars`;
    characterCount.textContent = `${chars} character${chars === 1 ? "" : "s"}`;
  }

  function swapDirection() {
    direction = direction === "c2a" ? "a2c" : "c2a";
    // Move existing output to input so user can continue working with the same text.
    const previousOutput = resultText.value;
    if (previousOutput) {
      sourceText.value = previousOutput;
    }
    applyDirection();
    render();
    sourceText.focus();
    showToast(
      direction === "c2a"
        ? "Cyrillic → Arabic"
        : "Arabic → Cyrillic"
    );
  }

  async function copyText(value, label) {
    if (!value) {
      showToast("Nothing to copy", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      showToast(label || "Copied to clipboard");
    } catch {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      try {
        document.execCommand("copy");
        showToast(label || "Copied to clipboard");
      } catch {
        showToast("Copy failed", "error");
      }
      document.body.removeChild(helper);
    }
  }

  function copyResult() {
    copyText(resultText.value, "Arabic text copied");
  }

  function copyArabicInput() {
    copyText(arabicInput.value, "Copied to clipboard");
  }

  /* ---------- Arabic input view ---------- */
  function renderArabicCount() {
    const count = arabicInput.value.length;
    arabicCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
    arabicMeta.textContent = `${count} chars`;
  }

  // Keyboard layout config: physical keyboard with modifiers per row.
  // unit = 1 standard key width; modifier keys take fractional widths.
  const KEYBOARD_LAYOUT = [
    {
      rowIndex: 0,
      before: [],
      after: [{ label: "Backspace", units: 2, mod: "backspace" }],
    },
    {
      rowIndex: 1,
      before: [{ label: "Tab", units: 1.5, mod: "tab" }],
      after: [],
    },
    {
      rowIndex: 2,
      before: [{ label: "Caps", units: 1.75, mod: "capslock" }],
      after: [{ label: "Enter", units: 2.25, mod: "enter" }],
    },
    {
      rowIndex: 3,
      before: [{ label: "Shift", units: 2.25, mod: "shift-left" }],
      after: [{ label: "Shift", units: 2.75, mod: "shift-right" }],
    },
  ];

  function renderKeyboardMap() {
    const rows = KEYBOARD_LAYOUT.map((cfg) => {
      const rowKeys = physicalKeyMap[cfg.rowIndex];
      const isSimpleRow = cfg.rowIndex === 0; // number row: no arabic mapping
      const modHtml = (m) =>
        `<div class="key key--mod" style="--w:${m.units}" data-mod="${m.mod}" aria-hidden="true"><span class="key-mod-label">${m.label}</span></div>`;
      const beforeMods = cfg.before.map(modHtml).join("");
      const afterMods = cfg.after.map(modHtml).join("");
      const keys = rowKeys
        .map((item) => {
          const homeClass = item.home ? " is-home" : "";
          const safeKey = item.key.replace(/"/g, "&quot;");
          const safeShift = item.shiftKey.replace(/"/g, "&quot;");
          if (isSimpleRow) {
            return `<button type="button" class="key key--char key--simple" data-key="${safeKey}" data-shift="${safeShift}" aria-label="Key ${item.key}; shift: ${item.shiftKey}">
              <span class="key-simple-shift">${escapeHtml(item.shiftKey)}</span>
              <span class="key-simple-base">${escapeHtml(item.key)}</span>
            </button>`;
          }
          return `<button type="button" class="key key--char${homeClass}" data-key="${safeKey}" data-shift="${safeShift}" aria-label="Key ${item.key}: ${item.normal}; shift: ${item.shift}">
            <span class="key-row key-row--top">
              <span class="key-latin">${escapeHtml(item.shiftKey)}</span>
              <span class="key-arabic" dir="rtl">${item.shift}</span>
            </span>
            <span class="key-row key-row--bottom">
              <span class="key-latin">${escapeHtml(item.key)}</span>
              <span class="key-arabic" dir="rtl">${item.normal}</span>
            </span>
            <span class="key-bump" aria-hidden="true"></span>
          </button>`;
        })
        .join("");
      return `<div class="kb-row">${beforeMods}${keys}${afterMods}</div>`;
    }).join("");

    const spaceRow = `
      <div class="kb-row">
        <div class="key key--mod" style="--w:1.25" data-mod="control-left" aria-hidden="true"><span class="key-mod-label">Ctrl</span></div>
        <div class="key key--mod" style="--w:1.25" data-mod="alt-left" aria-hidden="true"><span class="key-mod-label">Alt</span></div>
        <button type="button" class="key key--mod key--space" data-key=" " data-shift=" " data-mod="space" style="--w:6.25" aria-label="Space"><span class="key-mod-label">Space</span></button>
        <div class="key key--mod" style="--w:1.25" data-mod="alt-right" aria-hidden="true"><span class="key-mod-label">Alt</span></div>
        <div class="key key--mod" style="--w:1.25" data-mod="control-right" aria-hidden="true"><span class="key-mod-label">Ctrl</span></div>
      </div>`;

    keyboardMap.innerHTML = rows + spaceRow;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function flashKey(physicalKey) {
    if (!physicalKey) return;
    const card = keyboardMap.querySelector(
      `.key[data-key="${CSS.escape(physicalKey)}"]`
    );
    if (!card) return;
    card.classList.add("is-pressed");
    setTimeout(() => card.classList.remove("is-pressed"), 160);
  }

  function flashMod(modName) {
    if (!modName) return;
    const card = keyboardMap.querySelector(
      `.key[data-mod="${CSS.escape(modName)}"]`
    );
    if (!card) return;
    card.classList.add("is-pressed");
    setTimeout(() => card.classList.remove("is-pressed"), 160);
  }

  function modNameFromEvent(event) {
    // event.location: 1 = left, 2 = right
    const isRight = event.location === 2;
    switch (event.key) {
      case "Backspace":
        return "backspace";
      case "Tab":
        return "tab";
      case "CapsLock":
        return "capslock";
      case "Enter":
        return "enter";
      case "Shift":
        return isRight ? "shift-right" : "shift-left";
      case "Control":
        return isRight ? "control-right" : "control-left";
      case "Alt":
        return isRight ? "alt-right" : "alt-left";
      case " ":
        return "space";
      default:
        return null;
    }
  }

  /* ---------- View switching (hash-based routing) ---------- */
  const HASH_TO_VIEW = {
    "#converter": "converterView",
    "": "converterView",
    "#": "converterView",
    "#input": "inputView",
  };
  const VIEW_TO_HASH = {
    converterView: "#converter",
    inputView: "#input",
  };

  function viewFromHash() {
    return HASH_TO_VIEW[window.location.hash] || "converterView";
  }

  function showView(viewId) {
    document.querySelectorAll(".tool-view").forEach((view) => {
      view.classList.toggle("is-active", view.id === viewId);
    });
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.view === viewId);
    });
    if (viewId === "inputView") {
      setTimeout(() => arabicInput.focus(), 50);
    } else if (viewId === "converterView") {
      setTimeout(() => sourceText.focus(), 50);
    }
  }

  function syncFromHash() {
    showView(viewFromHash());
  }

  /* ---------- Theme ---------- */
  const THEME_KEY = "kaz-studio-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function initTheme() {
    let theme = localStorage.getItem(THEME_KEY);
    if (!theme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      theme = prefersDark ? "dark" : "light";
    }
    applyTheme(theme);
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
    showToast(next === "dark" ? "Dark theme on" : "Light theme on");
  }

  /* ---------- Event wiring ---------- */
  // Hash-based routing — clicks on nav <a href="#xxx"> update window.location.hash,
  // which triggers a single source of truth via the hashchange listener.
  window.addEventListener("hashchange", syncFromHash);

  // Normalize empty hash to canonical hash on first load so refresh stays stable.
  if (!window.location.hash) {
    history.replaceState(null, "", VIEW_TO_HASH.converterView);
  }

  sourceText.addEventListener("input", render);

  sampleButton.addEventListener("click", function () {
    sourceText.value = SAMPLES[direction];
    render();
    sourceText.focus();
    showToast("Sample text loaded");
  });

  clearButton.addEventListener("click", function () {
    if (!sourceText.value) return;
    sourceText.value = "";
    render();
    sourceText.focus();
  });

  if (swapButton) {
    swapButton.addEventListener("click", swapDirection);
  }

  copyButton.addEventListener("click", copyResult);

  arabicInput.addEventListener("keydown", function (event) {
    // Always highlight the modifier key if any.
    const mod = modNameFromEvent(event);
    if (mod) flashMod(mod);

    // For combo modifiers (Shift held while typing), highlight the active Shift too.
    if (event.shiftKey && event.key !== "Shift") {
      flashMod("shift-left");
    }

    const mapped = arabicKeyMap[event.key];
    if (!mapped || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    event.preventDefault();
    insertAtSelection(arabicInput, mapped);
    renderArabicCount();
    flashKey(event.key.toLowerCase());
  });

  arabicInput.addEventListener("input", renderArabicCount);

  clearArabicButton.addEventListener("click", function () {
    if (!arabicInput.value) return;
    arabicInput.value = "";
    renderArabicCount();
    arabicInput.focus();
  });

  copyArabicButton.addEventListener("click", copyArabicInput);

  // Click-to-insert from keyboard map
  keyboardMap.addEventListener("click", function (event) {
    const target = event.target.closest(".key");
    if (!target) return;

    // Char/space keys -> insert character.
    if (
      target.classList.contains("key--char") ||
      target.classList.contains("key--space")
    ) {
      const useShift = event.shiftKey;
      const physical = useShift ? target.dataset.shift : target.dataset.key;
      const value =
        arabicKeyMap[physical] !== undefined ? arabicKeyMap[physical] : physical;
      if (value === undefined) return;
      arabicInput.focus();
      insertAtSelection(arabicInput, value);
      renderArabicCount();
      target.classList.add("is-pressed");
      setTimeout(() => target.classList.remove("is-pressed"), 160);
      return;
    }

    // Pure modifier keys -> just flash for visual feedback.
    if (target.dataset.mod) {
      target.classList.add("is-pressed");
      setTimeout(() => target.classList.remove("is-pressed"), 160);
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", function (event) {
    // Ctrl/Cmd + J to toggle theme
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "j") {
      event.preventDefault();
      toggleTheme();
    }
  });

  /* ---------- Init ---------- */
  initTheme();
  applyDirection();
  renderKeyboardMap();
  renderArabicCount();
  render();
  syncFromHash();
})();
