/**
 * LOGIKA KALKULASI (calculation.js)
 * Kumpulan fungsi murni untuk operasi matematika dan penanganan error.
 */
const CalculatorCore = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error("Tidak bisa dibagi 0");
    return a / b;
  },

  /**
   * Mengevaluasi dua nilai berdasarkan operator
   */
  calculate: function (a, operator, b) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) return "Error";

    switch (operator) {
      case "+":
        return this.add(numA, numB);
      case "-":
        return this.subtract(numA, numB);
      case "*":
        return this.multiply(numA, numB);
      case "/":
        return this.divide(numA, numB);
      default:
        return numB;
    }
  },
};

// Variable State Kalkulator
let currentInput = "0";
let previousInput = "";
let selectedOperator = null;
let isResetScreen = false;

// Elemen DOM
const mainDisplay = document.getElementById("mainDisplay");
const expressionDisplay = document.getElementById("expressionDisplay");

/**
 * Memperbarui tampilan layar
 */
function updateDisplay() {
  mainDisplay.innerText = currentInput;

  if (selectedOperator !== null) {
    const symbolMap = { "*": "×", "/": "÷", "+": "+", "-": "−" };
    expressionDisplay.innerText = `${previousInput} ${symbolMap[selectedOperator] || selectedOperator}`;
  } else {
    expressionDisplay.innerText = "";
  }
}

/**
 * Menangani input angka (0-9)
 */
function handleNumber(number) {
  if (
    currentInput === "0" ||
    isResetScreen ||
    currentInput === "Error" ||
    currentInput === "Tidak bisa dibagi 0"
  ) {
    currentInput = number;
    isResetScreen = false;
  } else {
    currentInput += number;
  }
  updateDisplay();
}

/**
 * Menangani titik desimal
 */
function handleDecimal() {
  if (isResetScreen) {
    currentInput = "0.";
    isResetScreen = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

/**
 * Menangani pemilihan operator (+, -, *, /)
 */
function handleOperator(op) {
  if (currentInput === "Error" || currentInput === "Tidak bisa dibagi 0")
    return;

  if (selectedOperator !== null && !isResetScreen) {
    handleCalculate();
  }

  previousInput = currentInput;
  selectedOperator = op;
  isResetScreen = true;
  updateDisplay();
}

/**
 * Menghitung hasil (=)
 */
function handleCalculate() {
  if (selectedOperator === null || isResetScreen) return;

  try {
    const result = CalculatorCore.calculate(
      previousInput,
      selectedOperator,
      currentInput,
    );

    // Pembulatan angka desimal agar tidak terlalu panjang
    currentInput =
      typeof result === "number"
        ? Number(result.toFixed(8)).toString()
        : result;
    selectedOperator = null;
    previousInput = "";
    isResetScreen = true;
  } catch (error) {
    currentInput = error.message;
    selectedOperator = null;
    previousInput = "";
    isResetScreen = true;
  }

  updateDisplay();
}

/**
 * Clear (C) - Reset seluruh state kalkulator
 */
function handleClear() {
  currentInput = "0";
  previousInput = "";
  selectedOperator = null;
  isResetScreen = false;
  updateDisplay();
}

/**
 * Backspace - Menghapus 1 karakter terakhir
 */
function handleBackspace() {
  if (
    isResetScreen ||
    currentInput === "Error" ||
    currentInput === "Tidak bisa dibagi 0"
  )
    return;

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateDisplay();
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key) && key !== " ") {
    handleNumber(key);
  } else if (key === ".") {
    handleDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    handleCalculate();
  } else if (key === "Backspace") {
    handleBackspace();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    handleClear();
  }
});
