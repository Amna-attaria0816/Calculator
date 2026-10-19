document.addEventListener('DOMContentLoaded', () => {
  const previousOperandTextElement = document.getElementById('previousOperand');
  const currentOperandTextElement = document.getElementById('currentOperand');
  const numberButtons = document.querySelectorAll('[data-number]');
  const operatorButtons = document.querySelectorAll('[data-operator]');
  const equalsButton = document.getElementById('equalsBtn');
  const clearButton = document.getElementById('clearBtn');
  const deleteButton = document.getElementById('deleteBtn');
  const percentageButton = document.querySelector('[data-action="percentage"]');

  let currentOperand = '0';
  let previousOperand = '';
  let operation = undefined;
  let resetDisplayOnNextInput = false;

  // --- Core Calculator Functions ---

  function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    resetDisplayOnNextInput = false;
    updateDisplay();
  }

  function deleteLastDigit() {
    if (resetDisplayOnNextInput) {
      currentOperand = '0';
      resetDisplayOnNextInput = false;
      updateDisplay();
      return;
    }

    if (currentOperand === '0' || currentOperand.length === 1) {
      currentOperand = '0';
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  function appendNumber(number) {
    // Prevent multiple decimals
    if (number === '.' && currentOperand.includes('.')) return;

    if (currentOperand === '0' && number !== '.') {
      currentOperand = number;
    } else if (resetDisplayOnNextInput) {
      currentOperand = number === '.' ? '0.' : number;
      resetDisplayOnNextInput = false;
    } else {
      currentOperand += number;
    }

    updateDisplay();
  }

  function chooseOperation(selectedOperation) {
    if (currentOperand === '' && previousOperand === '') return;

    if (previousOperand !== '' && !resetDisplayOnNextInput) {
      compute();
    }

    operation = selectedOperation;
    previousOperand = currentOperand;
    resetDisplayOnNextInput = true;
    updateDisplay();
  }

  function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          alert('Cannot divide by zero!');
          clearAll();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Format results cleanly (limit precision errors)
    currentOperand = Math.round(computation * 1e8) / 1e8 + '';
    operation = undefined;
    previousOperand = '';
    resetDisplayOnNextInput = true;
    updateDisplay();
  }

  function calculatePercentage() {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;

    currentOperand = (current / 100).toString();
    updateDisplay();
  }

  function updateDisplay() {
    currentOperandTextElement.innerText = currentOperand;

    if (operation != null) {
      previousOperandTextElement.innerText = `${previousOperand} ${operation}`;
    } else {
      previousOperandTextElement.innerText = '';
    }
  }

  // --- Click Event Listeners ---

  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      appendNumber(button.getAttribute('data-number'));
    });
  });

  operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
      chooseOperation(button.getAttribute('data-operator'));
    });
  });

  equalsButton.addEventListener('click', compute);
  clearButton.addEventListener('click', clearAll);
  deleteButton.addEventListener('click', deleteLastDigit);
  percentageButton.addEventListener('click', calculatePercentage);

  // --- Bonus: Keyboard Support ---

  document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-') {
      chooseOperation(e.key);
    }
    if (e.key === '*') {
      chooseOperation('×');
    }
    if (e.key === '/') {
      e.preventDefault(); // Prevent browser quick-search shortcut
      chooseOperation('÷');
    }
    if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      compute();
    }
    if (e.key === 'Backspace') {
      deleteLastDigit();
    }
    if (e.key === 'Escape') {
      clearAll();
    }
    if (e.key === '%') {
      calculatePercentage();
    }
  });
});