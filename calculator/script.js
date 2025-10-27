// Math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error: Division by 0";
    }
    return a / b;
}

// Operate function
function operate(operator, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return null;
    }
}

// State variables
let firstNumber = '';
let secondNumber = '';
let currentOperator = null;
let shouldResetDisplay = false;

// Get elements
const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const decimalButton = document.getElementById('decimal');

}

// Update display
function updateDisplay(value) {
    if (value.toString().length > 12) {
        display.textContent = parseFloat(value).toExponential(6);
    } else {
        display.textContent = value;
    }
}

// Clear everything
function clearCalculator() {
    firstNumber = '';
    secondNumber = '';
    currentOperator = null;
    shouldResetDisplay = false;
    updateDisplay('0');
    removeOperatorHighlight();
}

// Handle number clicks
function handleNumber(number) {
    if (shouldResetDisplay) {
        display.textContent = '';
        shouldResetDisplay = false;
    }
    
    if (display.textContent === '0') {
        display.textContent = number;
    } else {
        display.textContent += number;
    }
}

// Handle operator clicks
function handleOperator(operator) {
    const currentValue = display.textContent;
    
    // Don't operate on errors
    if (currentValue.includes('Error')) {
        return;
    }
    
    // If there's already an operation, do it first
    if (currentOperator && !shouldResetDisplay) {
        secondNumber = currentValue;
        const result = operate(currentOperator, firstNumber, secondNumber);
        updateDisplay(roundResult(result));
        firstNumber = result.toString();
    } else {
        firstNumber = currentValue;
    }
    
    currentOperator = operator;
    shouldResetDisplay = true;
    highlightOperator(operator);
}

// Handle equals button
function handleEquals() {
    if (!currentOperator || shouldResetDisplay) {
        return;
    }
    
    secondNumber = display.textContent;
    const result = operate(currentOperator, firstNumber, secondNumber);
    
    if (typeof result === 'string') {
        updateDisplay(result);
        firstNumber = '';
        secondNumber = '';
        currentOperator = null;
    } else {
        updateDisplay(roundResult(result));
        firstNumber = result.toString();
        secondNumber = '';
        currentOperator = null;
    }
    
    shouldResetDisplay = true;
    removeOperatorHighlight();
}

// Decimal button
function handleDecimal() {
    if (shouldResetDisplay) {
        display.textContent = '0';
        shouldResetDisplay = false;
    }
    
    if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
}

// Backspace button
function handleBackspace() {
    if (shouldResetDisplay) {
        return;
    }
    
    const currentDisplay = display.textContent;
    
    if (currentDisplay.length === 1 || currentDisplay === 'Error: Division by 0') {
        display.textContent = '0';
    } else {
        display.textContent = currentDisplay.slice(0, -1);
    }
}

// Round long decimals
function roundResult(number) {
    if (typeof number === 'string') {
        return number;
    }
    return Math.round(number * 100000000) / 100000000;
}

// Show which operator is active
function highlightOperator(operator) {
    removeOperatorHighlight();
    operatorButtons.forEach(button => {
        if (button.dataset.operator === operator) {
            button.classList.add('active');
        }
    });
}

function removeOperatorHighlight() {
    operatorButtons.forEach(button => {
        button.classList.remove('active');
    });
}

// Event listeners for buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.dataset.operator);
    });
});

equalsButton.addEventListener('click', handleEquals);
clearButton.addEventListener('click', clearCalculator);
backspaceButton.addEventListener('click', handleBackspace);
decimalButton.addEventListener('click', handleDecimal);

});

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Numbers
    if (e.key >= 0 && e.key <= 9) {
        handleNumber(e.key);
    }
    
    // Decimal
    if (e.key === '.') {
        handleDecimal();
    }
    
    // Operators
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
    }
    
    // Equals
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
    }
    
    // Clear
    if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearCalculator();
    }
    
    // Backspace
    if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
    }
});
