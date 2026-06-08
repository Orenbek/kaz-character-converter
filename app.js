(function () {
  "use strict";

  const sample = `Қазақша жазуларды сәйкестіру-өлшемдендіру системасы
Білім, өзара үйрену. Кітап — Білім бұлағы.
Үш-ақ нәрсе адамның қасиеті,
Ыстық қайрат, нұрлы ақыл, жылы жүрек.`;

  const sourceText = document.querySelector("#sourceText");
  const resultText = document.querySelector("#resultText");
  const characterCount = document.querySelector("#characterCount");
  const copyStatus = document.querySelector("#copyStatus");
  const sampleButton = document.querySelector("#sampleButton");
  const clearButton = document.querySelector("#clearButton");
  const copyButton = document.querySelector("#copyButton");
  const arabicInput = document.querySelector("#arabicInput");
  const arabicCount = document.querySelector("#arabicCount");
  const arabicCopyStatus = document.querySelector("#arabicCopyStatus");
  const clearArabicButton = document.querySelector("#clearArabicButton");
  const copyArabicButton = document.querySelector("#copyArabicButton");
  const keyboardMap = document.querySelector("#keyboardMap");

  const physicalKeyMap = [
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
    ],
    [
      { key: "a", normal: "ھ", shiftKey: "A", shift: "ٵ" },
      { key: "s", normal: "س", shiftKey: "S", shift: "س" },
      { key: "d", normal: "د", shiftKey: "D", shift: "د" },
      { key: "f", normal: "ا", shiftKey: "F", shift: "ف" },
      { key: "g", normal: "ە", shiftKey: "G", shift: "گ" },
      { key: "h", normal: "ى", shiftKey: "H", shift: "ح" },
      { key: "j", normal: "ق", shiftKey: "J", shift: "ج" },
      { key: "k", normal: "ك", shiftKey: "K", shift: "ك" },
      { key: "l", normal: "ل", shiftKey: "L", shift: "ل" },
      { key: ";", normal: "؛", shiftKey: ":", shift: ":" },
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

  const arabicKeyMap = physicalKeyMap
    .flat()
    .reduce((map, item) => {
      map[item.key] = item.normal;
      map[item.shiftKey] = item.shift;
      return map;
    }, {});

  function insertAtSelection(textarea, value) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value =
      textarea.value.slice(0, start) + value + textarea.value.slice(end);
    const nextPosition = start + value.length;
    textarea.setSelectionRange(nextPosition, nextPosition);
  }

  function render() {
    resultText.value = window.KazakhConverter.kazakhCyrillicToArabic(
      sourceText.value
    );
    const count = sourceText.value.length;
    characterCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
    copyStatus.textContent = "";
  }

  async function copyResult() {
    if (!resultText.value) {
      copyStatus.textContent = "Nothing to copy";
      return;
    }

    try {
      await navigator.clipboard.writeText(resultText.value);
      copyStatus.textContent = "Copied";
    } catch {
      resultText.select();
      document.execCommand("copy");
      copyStatus.textContent = "Copied";
    }
  }

  async function copyArabicInput() {
    if (!arabicInput.value) {
      arabicCopyStatus.textContent = "Nothing to copy";
      return;
    }

    try {
      await navigator.clipboard.writeText(arabicInput.value);
      arabicCopyStatus.textContent = "Copied";
    } catch {
      arabicInput.select();
      document.execCommand("copy");
      arabicCopyStatus.textContent = "Copied";
    }
  }

  function renderArabicCount() {
    const count = arabicInput.value.length;
    arabicCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
    arabicCopyStatus.textContent = "";
  }

  function renderKeyboardMap() {
    keyboardMap.innerHTML = physicalKeyMap
      .map((row) => {
        const keys = row
          .map((item) => {
            const wideClass = item.key === "[" || item.key === "]" ? " wide" : "";
            return `<div class="key-card${wideClass}">
              <div class="key-layer shift">
                <span class="key-source">${item.shiftKey}</span>
                <span class="key-target" dir="rtl">${item.shift}</span>
              </div>
              <div class="key-divider"></div>
              <div class="key-layer">
                <span class="key-source">${item.key}</span>
                <span class="key-target" dir="rtl">${item.normal}</span>
              </div>
            </div>`;
          })
          .join("");
        return `<div class="keyboard-row">${keys}</div>`;
      })
      .join("");
  }

  function showView(viewId) {
    document.querySelectorAll(".tool-view").forEach((view) => {
      view.classList.toggle("is-active", view.id === viewId);
    });
    document.querySelectorAll(".nav-item").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === viewId);
    });
  }

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", function () {
      showView(button.dataset.view);
    });
  });
  sourceText.addEventListener("input", render);
  sampleButton.addEventListener("click", function () {
    sourceText.value = sample;
    render();
    sourceText.focus();
  });
  clearButton.addEventListener("click", function () {
    sourceText.value = "";
    render();
    sourceText.focus();
  });
  copyButton.addEventListener("click", copyResult);
  arabicInput.addEventListener("keydown", function (event) {
    const mapped = arabicKeyMap[event.key];

    if (!mapped || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    event.preventDefault();
    insertAtSelection(arabicInput, mapped);
    renderArabicCount();
  });
  arabicInput.addEventListener("input", renderArabicCount);
  clearArabicButton.addEventListener("click", function () {
    arabicInput.value = "";
    renderArabicCount();
    arabicInput.focus();
  });
  copyArabicButton.addEventListener("click", copyArabicInput);

  renderKeyboardMap();
  renderArabicCount();
  render();
})();
